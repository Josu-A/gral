import Dockerode from "dockerode";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";

import type { TestCase } from "./languages/common/schemas.js";

import { PreError, RunnerError } from "./common/errors.js";
import {
    Language,
    Phase,
    ProcessedAttempt,
    ProcessedTest,
    StepPhase,
    TestCommands,
} from "./languages/common/types.js";

interface ContainerMounts {
    artifacts: string;
    src: string;
    tests: string;
}

interface ContainerRunResult {
    exitCode: null | number;
    stderr: string;
    stdout: string;
    timeout: boolean;
}

type ProcessedTestWithMetadata = Pick<
    TestCase,
    "name" | "order" | "testId" | "timeout" | "weight"
> &
    ProcessedTest;

interface RunAttemptOptions<TAttempt> {
    attempt: TAttempt;
    language: Language<TAttempt>;
    tests: Array<TestCase>;
}

interface RunAttemptPreResult {
    duration: number;
    exitCode: null | number;
    stderr: string;
    stdout: string;
    success: boolean;
}

interface RunAttemptResult {
    duration: number;
    error: null | string;
    preRun: null | RunAttemptPreResult;
    testResults?: Array<TestResult>;
}

interface RunContainerOptions {
    args: Array<string>;
    image: string;
    memoryLimit?: number;
    mounts: ContainerMounts;
    phase: StepPhase;
    timeout: number;
}

type TestResult = Pick<TestCase, "name" | "order" | "testId" | "weight"> & {
    duration: number;
    exitCode: null | number;
    phase: null | string;
    status: TestStatus;
    stderr: string;
    stdout: string;
};

type TestStatus = "error" | "failed" | "passed" | "skipped" | "timed_out";

const COMPILE_MEMORY_LIMIT_BYTES = 1 * 1_024 * 1_024 * 1_024;
const BUFFER_TIMEOUT = 5 * 1_000;
const MAX_TEST_TIMEOUT = 5 * 60 * 1_000;
const MAX_ATTEMPT_PRE_TIMEOUT = 30 * 1_000;
const MEMORY_LIMIT_BYTES = 512 * 1_024 * 1_024;
const CPU_LIMIT_NANOSECONDS = 1 * 1_000_000_000;
const PIDS_LIMIT = 128;
const TMPFS_SIZE = "64m";
const MAX_OUTPUT_CHARACTERS = 10_000;

const docker = new Dockerode();

function getTotalTimeout(tests: Array<TestCase>): number {
    const timeout = tests.reduce((acc, test) => acc + test.timeout, 0);
    const bufferedTimeout = timeout + BUFFER_TIMEOUT * tests.length;
    return Math.min(bufferedTimeout, MAX_TEST_TIMEOUT);
}

function processRemainingTime(maxTimeout: number, initialTime: number): number {
    const elapsedTime = Date.now() - initialTime;
    const remainingTime = maxTimeout - elapsedTime;
    return Math.max(remainingTime, 0);
}

function returnError(
    message: string,
    testCases: Array<TestCase>,
    data: { duration: number; status: TestStatus },
): RunAttemptResult {
    return {
        duration: data.duration,
        error: message,
        preRun: null,
        testResults: testCases.map((testCase) => ({
            duration: 0,
            exitCode: null,
            name: testCase.name,
            order: testCase.order,
            phase: null,
            status: data.status,
            stderr: "",
            stdout: "",
            testId: testCase.testId,
            weight: testCase.weight,
        })),
    };
}

function returnPreError(
    preRun: RunAttemptPreResult,
    testCases: Array<TestCase>,
    data: { duration: number },
): RunAttemptResult {
    return {
        duration: data.duration,
        error: null,
        preRun,
        testResults: testCases.map((testCase) => ({
            duration: 0,
            exitCode: preRun.exitCode,
            name: testCase.name,
            order: testCase.order,
            phase: "pre",
            status: "skipped",
            stderr: preRun.stderr,
            stdout: preRun.stdout,
            testId: testCase.testId,
            weight: testCase.weight,
        })),
    };
}

async function runAttempt<TAttempt>(
    options: RunAttemptOptions<TAttempt>,
): Promise<RunAttemptResult> {
    const startTime = Date.now();
    const { attempt, language, tests } = options;

    const totalTimeout = getTotalTimeout(tests);

    const processedAttempt: ProcessedAttempt = language.processAttempt(attempt);
    const processedTests: Array<ProcessedTestWithMetadata> = tests.map(
        (test) => ({
            ...language.processTest(test.code, test.fileName),
            name: test.name,
            order: test.order,
            testId: test.testId,
            timeout: test.timeout,
            weight: test.weight,
        }),
    );

    const uniqueFileNameError = verifyUniqueTestFileNames(processedTests);
    if (uniqueFileNameError) {
        return returnError(uniqueFileNameError, tests, {
            duration: 0,
            status: "error",
        });
    }

    let rootDir: null | string = null;
    try {
        rootDir = await mkdtemp(
            join(tmpdir(), `code-execution-${language.id}`),
        );
        const srcDir = join(rootDir, "src");
        const testsDir = join(rootDir, "tests");
        const artifactsDir = join(rootDir, "artifacts");

        await Promise.all([
            mkdir(srcDir, { recursive: true }),
            mkdir(testsDir, { recursive: true }),
            mkdir(artifactsDir, { mode: 0o777, recursive: true }),
        ]);

        const mounts: ContainerMounts = {
            artifacts: artifactsDir,
            src: srcDir,
            tests: testsDir,
        };

        await Promise.all([
            ...processedAttempt.files.map((files) =>
                writeFile(join(srcDir, files.name), files.content),
            ),
            ...processedTests.flatMap((processedTest) =>
                processedTest.files.map((file) =>
                    writeFile(join(testsDir, file.name), file.content),
                ),
            ),
        ]);

        let attemptPreResult: null | RunAttemptPreResult = null;
        if (processedAttempt.pre) {
            attemptPreResult = await runAttemptPreCommands(
                {
                    initialTime: startTime,
                    maxTimeout: totalTimeout,
                },
                {
                    image: language.image,
                    mounts,
                    preCommands: processedAttempt.pre,
                },
            );
        }

        const testResults: Array<TestResult> = await runTests(
            {
                initialTime: startTime,
                maxTimeout: totalTimeout,
            },
            {
                image: language.image,
                mounts,
                tests: processedTests,
            },
        );

        return {
            duration: Date.now() - startTime,
            error: null,
            preRun: attemptPreResult,
            testResults: testResults,
        };
    } catch (err: unknown) {
        if (err instanceof RunnerError) {
            return returnError(err.message, tests, {
                duration: Date.now() - startTime,
                status: "skipped",
            });
        }
        if (err instanceof PreError) {
            return returnPreError(err.preRun, tests, {
                duration: Date.now() - startTime,
            });
        }
        const errorMessage =
            err instanceof Error
                ? err.message
                : "An unknown error occurred during code execution.";
        return returnError(errorMessage, tests, {
            duration: Date.now() - startTime,
            status: "error",
        });
    } finally {
        if (rootDir) {
            await rm(rootDir, { force: true, recursive: true });
        }
    }
}

async function runAttemptPreCommands(
    time: { initialTime: number; maxTimeout: number },
    dockerOptions: {
        image: string;
        mounts: ContainerMounts;
        preCommands: TestCommands;
    },
): Promise<RunAttemptPreResult> {
    const remainingTime = processRemainingTime(
        time.maxTimeout,
        time.initialTime,
    );
    const timeout = Math.min(remainingTime, MAX_ATTEMPT_PRE_TIMEOUT);
    if (timeout <= 0) {
        throw new RunnerError(
            "Attempt pre-commands timed out before they could start.",
        );
    }

    const preStartTime = Date.now();
    const result = await runInsideContainer({
        args: dockerOptions.preCommands.args,
        image: dockerOptions.image,
        memoryLimit: COMPILE_MEMORY_LIMIT_BYTES,
        mounts: dockerOptions.mounts,
        phase: dockerOptions.preCommands.phase,
        timeout: timeout,
    });

    const preRun: RunAttemptPreResult = {
        duration: Date.now() - preStartTime,
        exitCode: result.exitCode,
        stderr: result.stderr,
        stdout: result.stdout,
        success: !result.timeout && !result.exitCode,
    };

    if (!preRun.success) {
        throw new PreError(preRun);
    }

    return preRun;
}

async function runInsideContainer(
    options: RunContainerOptions,
): Promise<ContainerRunResult> {
    const { args, image, memoryLimit, mounts, phase, timeout } = options;

    const artifactsMode = phase === Phase.Compile ? "rw" : "ro";
    const memory = memoryLimit ?? MEMORY_LIMIT_BYTES;

    const container = await docker.createContainer({
        AttachStderr: true,
        AttachStdout: true,
        Cmd: args,
        HostConfig: {
            AutoRemove: true,
            Binds: [
                `${mounts.src}:/opt/code-execution/src:ro`,
                `${mounts.tests}:/opt/code-execution/tests:ro`,
                `${mounts.artifacts}:/opt/code-execution/out:${artifactsMode}`,
            ],
            CapDrop: ["ALL"],
            Memory: memory,
            MemorySwap: memory,
            NanoCpus: CPU_LIMIT_NANOSECONDS,
            PidsLimit: PIDS_LIMIT,
            ReadonlyRootfs: true,
            SecurityOpt: ["no-new-privileges"],
            Tmpfs: {
                "/tmp": `rw,size=${TMPFS_SIZE},mode=1777,nodev,nosuid`,
            },
        },
        Image: image,
        NetworkDisabled: true,
        OpenStdin: false,
        Tty: false,
        WorkingDir: "/opt/code-execution",
    });

    let timedOut = false;
    let maxLengthReached = false;
    let containerKilled = false;
    let stderr = "";
    let stdout = "";
    let timeoutHandle: NodeJS.Timeout | undefined;
    let exitCode: null | number = null;

    const stdoutStream = new PassThrough({ encoding: "utf8" });
    const stderrStream = new PassThrough({ encoding: "utf8" });

    const killContainer = async (): Promise<void> => {
        if (containerKilled) {
            return;
        }
        containerKilled = true;
        try {
            await container.kill();
        } catch {
            /* container already killed */
        }
    };

    const handleStreamData = (
        chunk: string,
        currentData: string,
        truncatedText: string,
    ): string => {
        if (currentData.length >= MAX_OUTPUT_CHARACTERS) {
            return currentData;
        }
        let newData = currentData + chunk;
        if (newData.length > MAX_OUTPUT_CHARACTERS) {
            maxLengthReached = true;
            void killContainer();
            newData = newData.slice(0, MAX_OUTPUT_CHARACTERS) + truncatedText;
        }
        return newData;
    };

    stdoutStream.on("data", (chunk: string) => {
        stdout = handleStreamData(chunk, stdout, "\n...[stdout truncated]");
    });

    stderrStream.on("data", (chunk: string) => {
        stderr = handleStreamData(chunk, stderr, "\n...[stderr truncated]");
    });

    try {
        const attachStream = await container.attach({
            stderr: true,
            stdout: true,
            stream: true,
        });
        container.modem.demuxStream(attachStream, stdoutStream, stderrStream);

        const attachStreamFinished = new Promise<void>((resolve) => {
            attachStream.on("end", resolve);
            attachStream.on("error", resolve);
            attachStream.on("close", resolve);
        });

        await container.start();

        timeoutHandle = setTimeout(() => {
            timedOut = true;
            void killContainer();
        }, timeout);

        try {
            const waitResult = await container.wait();
            exitCode =
                typeof waitResult?.StatusCode === "number"
                    ? waitResult.StatusCode
                    : null;
        } catch (err: unknown) {
            if (err instanceof Error) {
                stderr += `\n[Error while waiting for container] ${err.message}`;
            }
        }
        await attachStreamFinished;
    } catch {
        await killContainer();
        try {
            await container.remove({ force: true });
        } catch {
            /* container already removed */
        }
    } finally {
        clearTimeout(timeoutHandle);
    }
    return {
        exitCode,
        stderr: stderr + (timedOut ? "\n[Process killed due to timeout]" : ""),
        stdout,
        timeout: timedOut || maxLengthReached,
    };
}

async function runTest(
    test: ProcessedTestWithMetadata,
    dockerOptions: {
        image: string;
        mounts: ContainerMounts;
    },
    time: { initialTime: number; maxTimeout: number },
): Promise<TestResult> {
    const remainingTime = processRemainingTime(
        time.maxTimeout,
        time.initialTime,
    );

    if (remainingTime <= 0) {
        return {
            duration: 0,
            exitCode: null,
            name: test.name,
            order: test.order,
            phase: null,
            status: "skipped",
            stderr: "",
            stdout: "",
            testId: test.testId,
            weight: test.weight,
        };
    }

    const testStartTime = Date.now();
    const testMaxTimeout = test.timeout + BUFFER_TIMEOUT;

    const getCurrentTestTimeout = (): number => {
        const individualRemainingTime = processRemainingTime(
            testMaxTimeout,
            testStartTime,
        );
        return Math.min(remainingTime, individualRemainingTime);
    };

    let stdoutFull = "";
    let stderrFull = "";
    let lastRunPhase: null | string = null;
    let lastExitCode: null | number = null;
    const hasMultipleSteps = test.steps.length > 1;

    const appendOutput = (
        current: string,
        chunk: string,
        phase: string,
    ): string => {
        if (!chunk) {
            return current;
        }
        if (hasMultipleSteps) {
            const needsNewline = current.length > 0 && !current.endsWith("\n");
            const headerPrefix = needsNewline ? "\n" : "";
            return `${current}${headerPrefix}*** ${phase} ***\n${chunk}`;
        }
        return current + chunk;
    };

    for (const step of test.steps) {
        lastRunPhase = step.phase;
        const testRemainingTime = getCurrentTestTimeout();
        if (testRemainingTime <= 0) {
            return {
                duration: Date.now() - testStartTime,
                exitCode: null,
                name: test.name,
                order: test.order,
                phase: lastRunPhase,
                status: "timed_out",
                stderr: stderrFull,
                stdout: stdoutFull,
                testId: test.testId,
                weight: test.weight,
            };
        }
        const result = await runInsideContainer({
            args: step.args,
            image: dockerOptions.image,
            mounts: dockerOptions.mounts,
            phase: step.phase,
            timeout: testRemainingTime,
        });

        stdoutFull = appendOutput(stdoutFull, result.stdout, step.phase);
        stderrFull = appendOutput(stderrFull, result.stderr, step.phase);

        lastExitCode = result.exitCode;

        if (result.timeout) {
            return {
                duration: Date.now() - testStartTime,
                exitCode: lastExitCode,
                name: test.name,
                order: test.order,
                phase: step.phase,
                status: "timed_out",
                stderr: stderrFull,
                stdout: stdoutFull,
                testId: test.testId,
                weight: test.weight,
            };
        }
        if (result.exitCode !== 0) {
            return {
                duration: Date.now() - testStartTime,
                exitCode: lastExitCode,
                name: test.name,
                order: test.order,
                phase: step.phase,
                status: "failed",
                stderr: stderrFull,
                stdout: stdoutFull,
                testId: test.testId,
                weight: test.weight,
            };
        }
    }

    return {
        duration: Date.now() - testStartTime,
        exitCode: lastExitCode,
        name: test.name,
        order: test.order,
        phase: lastRunPhase,
        status: "passed",
        stderr: stderrFull,
        stdout: stdoutFull,
        testId: test.testId,
        weight: test.weight,
    };
}

async function runTests(
    time: { initialTime: number; maxTimeout: number },
    options: {
        image: string;
        mounts: ContainerMounts;
        tests: Array<ProcessedTestWithMetadata>;
    },
): Promise<Array<TestResult>> {
    const results: Array<TestResult> = [];
    for (const test of options.tests) {
        const result: TestResult = await runTest(
            test,
            {
                image: options.image,
                mounts: options.mounts,
            },
            time,
        );
        results.push(result);
    }
    return results;
}

function verifyUniqueTestFileNames(
    processedTests: Array<ProcessedTest>,
): null | string {
    const fileNames = new Set<string>();
    for (const processedTest of processedTests) {
        for (const file of processedTest.files) {
            if (fileNames.has(file.name)) {
                return `Duplicate test filename "${file.name}". All test files must have unique names.`;
            }
            fileNames.add(file.name);
        }
    }
    return null;
}

export { runAttempt };

export type { RunAttemptPreResult, RunAttemptResult };
