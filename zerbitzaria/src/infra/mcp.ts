import type { SubmissionContextTest } from "@domain/attempts/local/types/schemas";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import logger from "@common/constants/logger";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface ExecuteCodeInput {
    attempt: {
        header: null | string;
        source: string;
    };
    tests: Array<SubmissionContextTest>;
}

interface ExecuteCodeResult {
    isError: boolean;
    output: string;
}

interface MCPTool {
    description?: string;
    input_schema: unknown;
    name: string;
}

class MCPClient {
    private mcp: Client;
    private tools: Array<MCPTool> = [];
    private transport: null | StdioClientTransport = null;

    constructor() {
        this.mcp = new Client({
            name: "backend-mcp-client",
            version: "1.0.0",
        });
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
            output: this.getToolResultText(result),
        };
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
