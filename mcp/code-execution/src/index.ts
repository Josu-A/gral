import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import logger from "./common/logger.js";
import { cLanguage } from "./languages/c.js";
import {
    attemptInputSchema,
    cAttemptInputSchema,
    type TestCase,
    testCasesInputSchema,
} from "./languages/common/schemas.js";
import { Language } from "./languages/common/types.js";
import { javaLanguage } from "./languages/java.js";
import { pythonLanguage } from "./languages/python.js";
import { runAttempt, RunAttemptResult } from "./runner.js";

const server = new McpServer({
    name: "code-execution",
    version: "1.0.0",
});

function formatRunAttemptResult(result: RunAttemptResult): string {
    if (result.error) {
        return `Errore bat gertatu da: ${result.error}`;
    }
    if (result.preRun && !result.preRun.success) {
        return `Errore bat gertatu da pre-run fasean. Irteera kodea ${result.preRun.exitCode} izan da eta ${result.preRun.duration} ms iraun du.`;
    }
    const passedTests =
        result.testResults?.filter(
            (testResult) => testResult.status === "passed",
        ).length ?? 0;
    const totalTests = result.testResults?.length ?? 0;
    const resultMsg = [
        `Exekuzioak ${result.duration} ms iraun du. ${passedTests}/${totalTests} test gainditu dira.`,
    ];
    for (const testResult of result.testResults ?? []) {
        resultMsg.push(
            `  [${testResult.status}] ${testResult.phase} @ ${testResult.name} - ${testResult.duration} ms`,
        );
    }
    return resultMsg.join("\n");
}

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Code execution MCP zerbitzaria abiarazi da.");
}

async function runCodeExecutionTool<TAttempt>(
    language: Language<TAttempt>,
    attempt: TAttempt,
    tests: Array<TestCase>,
): Promise<CallToolResult> {
    logger.info(
        `Running code execution tool for language "${language.name}" and ${tests.length} test(s).`,
    );
    const result = await runAttempt<TAttempt>({
        attempt,
        language,
        tests,
    });
    return {
        content: [
            {
                text: formatRunAttemptResult(result),
                type: "text",
            },
        ],
        isError: result.error !== null,
    };
}

server.registerTool(
    "run_python_exercise",
    {
        description:
            "Takes the student's code attempt and runs it against the provided test cases, returning pass/fail results and any relevant output.",
        inputSchema: {
            attempt: attemptInputSchema.meta({
                description: "Python source code for the student's attempt.",
            }),
            tests: testCasesInputSchema.meta({
                description:
                    "Python source code containing the test cases to run against the student's attempt.",
            }),
        },
        title: "Run a Python exercise against multiple test cases",
    },
    async ({ attempt, tests }) =>
        runCodeExecutionTool(pythonLanguage, attempt, tests),
);

server.registerTool(
    "run_java_exercise",
    {
        description:
            "Takes the student's code attempt and runs it against the provided test cases, returning pass/fail results and any relevant output.",
        inputSchema: {
            attempt: attemptInputSchema.meta({
                description: "Java source code for the student's attempt.",
            }),
            tests: testCasesInputSchema.meta({
                description:
                    "Java source code containing the test cases to run against the student's attempt.",
            }),
        },
        title: "Run a Java exercise against multiple test cases",
    },
    async ({ attempt, tests }) =>
        runCodeExecutionTool(javaLanguage, attempt, tests),
);

server.registerTool(
    "run_c_exercise",
    {
        description:
            "Takes the student's code attempt and runs it against the provided test cases, returning pass/fail results and any relevant output.",
        inputSchema: {
            attempt: cAttemptInputSchema.meta({
                description:
                    "Object containing the student's C code attempt, including optional header code.",
            }),
            tests: testCasesInputSchema.meta({
                description:
                    "C source code containing the test cases to run against the student's attempt.",
            }),
        },
        title: "Run a C exercise against multiple test cases",
    },
    async ({ attempt, tests }) =>
        runCodeExecutionTool(cLanguage, attempt, tests),
);

main().catch((error: unknown) => {
    const errorMsg: string =
        error instanceof Error ? error.message : String(error);
    logger.error("Errore bat gertatu da:", errorMsg);
    process.exit(1);
});
