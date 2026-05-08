import {
    type Language,
    Phase,
    type ProcessedAttempt,
    type ProcessedTest,
} from "./common/types.js";

interface CAttempt {
    header?: string;
    source: string;
}

const C_FLAGS =
    "-O0 -Wall -Wextra --std=c23 -g1 -fsanitize=address,undefined -fno-omit-frame-pointer -I/tmp/src";

const cLanguage: Language<CAttempt> = {
    id: "c",
    image: "code-execution-c:latest",
    name: "C",
    processAttempt(attempt: CAttempt): ProcessedAttempt {
        const files = [
            {
                content: attempt.source,
                name: "solution.c",
            },
        ];
        if (attempt.header) {
            files.push({
                content: attempt.header,
                name: "solution.h",
            });
        }
        return {
            files: files,
            pre: {
                args: [
                    "sh",
                    "-c",
                    `gcc ${C_FLAGS} -c /opt/code-execution/src/solution.c -o /dev/null`,
                ],
            },
        };
    },
    processTest(test: string, fileName: string): ProcessedTest {
        const fileNameWithTestPrefix = `test_${fileName}`;
        const executable = `/opt/code-execution/out/${fileName.replace(".c", "")}`;
        return {
            files: [
                {
                    content: test,
                    name: fileNameWithTestPrefix,
                },
            ],
            steps: [
                {
                    args: [
                        "sh",
                        "-c",
                        `gcc ${C_FLAGS} /opt/code-execution/src/solution.c /opt/code-execution/tests/${fileNameWithTestPrefix} -o ${executable}`,
                    ],
                    phase: Phase.Compile,
                },
                {
                    args: [
                        "sh",
                        "-c",
                        `ASAN_OPTIONS=detect_leaks=0:abort_on_error=1 ` +
                            `UBSAN_OPTIONS=print_stacktrace=1 ` +
                            executable,
                    ],
                    phase: Phase.Run,
                },
            ],
        };
    },
};

export { cLanguage };
