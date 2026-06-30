import type {
    RunAttemptResult,
    SubmissionContextTest,
} from "@domain/attempts/local/types/schemas";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type OpenAI from "openai";

import { environment } from "@common/constants/env";
import logger from "@common/constants/logger";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
    getDefaultEnvironment,
    StdioClientTransport,
} from "@modelcontextprotocol/sdk/client/stdio.js";

interface ExecuteCodeInput {
    attempt: {
        header: null | string;
        source: string;
    };
    tests: Array<SubmissionContextTest>;
}

interface ExecuteCodeResult {
    isError: boolean;
    output: null | RunAttemptResult;
}

interface ExecuteToolResult {
    content: string;
    isError: boolean;
}

interface MCPTool {
    description?: string;
    input_schema: unknown;
    name: string;
}

class MCPClient {
    private mcp: Client;
    private openAITools: Array<OpenAI.ChatCompletionTool> = [];
    private tools: Array<MCPTool> = [];
    private transport: null | StdioClientTransport = null;

    constructor() {
        this.mcp = new Client({
            name: "backend-mcp-client",
            version: "1.0.0",
        });
    }

    async callTool(
        name: string,
        args: Record<string, unknown>,
    ): Promise<ExecuteToolResult> {
        try {
            const result = (await this.mcp.callTool({
                arguments: args,
                name,
            })) as CallToolResult;
            logger.info("MCP tresna deitu da", { args, toolName: name });
            return {
                content: this.getToolResultText(result),
                isError: !!result.isError,
            };
        } catch (error: unknown) {
            logger.error("MCP tresna deitzean errorea", {
                args,
                error,
                toolName: name,
            });
            return {
                content: `Tool call failed: ${
                    error instanceof Error ? error.message : String(error)
                }`,
                isError: true,
            };
        }
    }

    async closeConnection(): Promise<void> {
        try {
            await this.mcp.close();
        } catch (error) {
            logger.error("Failed to close MCP connection", { error });
            throw error;
        }

        if (this.transport) {
            try {
                this.transport.close();
            } catch (error) {
                logger.error("Failed to close MCP transport", { error });
            }
            this.transport = null;
        }
    }

    async connectToServer(serverScriptPath: string): Promise<void> {
        try {
            const isJs = serverScriptPath.endsWith(".js");
            if (!isJs) {
                throw new Error("Server script must be a .js file");
            }
            const command = process.execPath;

            this.transport = new StdioClientTransport({
                args: [serverScriptPath],
                command,
                env: {
                    ...getDefaultEnvironment(),
                    ...(environment.DOCKER_HOST
                        ? { DOCKER_HOST: environment.DOCKER_HOST }
                        : {}),
                },
            });
            await this.mcp.connect(this.transport, {
                timeout: 5 * 60 * 1_000,
            });

            const toolResult = await this.mcp.listTools();
            this.tools = toolResult.tools.map((tool) => ({
                description: tool.description,
                input_schema: tool.inputSchema,
                name: tool.name,
            }));
            this.openAITools = toolResult.tools.map((tool) => ({
                function: {
                    description:
                        tool.description ||
                        `Execute code using the ${tool.name} tool`,
                    name: tool.name,
                    parameters: tool.inputSchema,
                },
                type: "function",
            }));
            logger.info(
                "Connected to MCP server with tools",
                this.tools.map((tool) => tool.name),
            );
        } catch (error) {
            logger.error("Failed to connect to MCP server", { error });
            throw error;
        }
    }

    async executeCode(
        language: string,
        payload: ExecuteCodeInput,
    ): Promise<ExecuteCodeResult> {
        const toolName = this.getToolByLanguage(language);
        const tool = this.tools.find((t) => t.name === toolName);
        if (!tool) {
            throw new Error(`Tool not found for language: ${language}`);
        }

        const filteredPayload = {
            attempt:
                toolName === this.getToolByLanguage("C")
                    ? {
                          header: payload.attempt.header,
                          source: payload.attempt.source,
                      }
                    : payload.attempt.source,
            tests: payload.tests.map((test) => ({
                code: test.testa_kodea,
                fileName: test.fitxategi_izena,
                name: test.izena,
                order: test.ordena,
                testId: test.testa_id,
                timeout: test.timeout,
                weight: test.pisua,
            })),
        };

        const result = (await this.mcp.callTool({
            arguments: filteredPayload,
            name: toolName,
        })) as CallToolResult;

        return {
            isError: !!result.isError,
            output: this.getCodeExecutionToolResult(result),
        };
    }

    public getAvailableTools(): Array<OpenAI.ChatCompletionTool> {
        return this.openAITools;
    }

    private getCodeExecutionToolResult(
        result: CallToolResult,
    ): null | RunAttemptResult {
        if (!result.content) {
            return null;
        }
        const contentText = result.content
            .filter((item) => item.type === "text")
            .map((item) => item.text)?.[0];
        return contentText ? JSON.parse(contentText) : null;
    }

    private getToolByLanguage(language: string): string {
        const lowerLanguage = language.toLowerCase();
        const toolName = `run_${lowerLanguage}_exercise`;
        return toolName;
    }

    private getToolResultText(result: CallToolResult): string {
        if (!result.content) {
            return "";
        }

        return result.content
            .filter((item) => item.type === "text")
            .map((item) => item.text)
            .join("\n");
    }
}

const mcpClient = new MCPClient();

export default mcpClient;
