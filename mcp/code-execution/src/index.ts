import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
//import { z } from "zod";

import logger from "./common/logger.js";

const server = new McpServer({
    name: "code-execution",
    version: "1.0.0",
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Code execution MCP zerbitzaria abiarazi da.");
}

main().catch((error: unknown) => {
    const errorMsg: string =
        error instanceof Error ? error.message : String(error);
    logger.error("Errore bat gertatu da:", errorMsg);
    process.exit(1);
});
