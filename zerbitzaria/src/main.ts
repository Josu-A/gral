import app from "@app";
import { environment } from "@common/constants/env";
import logger from "@common/constants/logger";
import { isErrno } from "@common/utils/errors";
import db, { checkDBConnection } from "@gral/datu-basea";
import { startTokenCleanup } from "@infra/cron/cleanRefreshTokens";
import mcpClient from "@infra/mcp";
import {
    connections,
    handleConnection,
    serverState,
} from "@routers/middleware/shutdown";
import { Server } from "http";

function handleListen(error?: Error): void {
    if (error) {
        if (isErrno(error)) {
            switch (error.code) {
                case "EACCES":
                    logger.error(
                        "Zehaztutako ataka erabiltzeko baimenik ez du",
                    );
                    break;
                case "EADDRINUSE":
                    logger.error(
                        "Zehaztutako ataka jada beste zerbitzari batek erabiltzen ari da",
                    );
                    break;
                default:
                    logger.error(
                        `Zerbitzarian ${error.code} errorea gertatu da: ${error.message}`,
                    );
            }
        } else {
            logger.error(
                `Zerbitzarian errore bat gertatu da: ${error.message}`,
            );
        }
        process.exit(1);
    }
    logger.info(`Zerbitzaria ${environment.SERVER_PORT} portuan entzuten.`);
}

async function shutdown(server: Server, signal: string): Promise<void> {
    if (serverState.isShuttingDown) {
        return;
    }
    serverState.isShuttingDown = true;

    logger.info(`${signal} seinalea jaso da, zerbitzaria itzaltzen...`);

    const forcedShutdown = setTimeout(() => {
        logger.error(
            "Zerbitzaria ezin izan da denbora mugan itzali, behartu egingo da.",
        );
        process.exit(1);
    }, 10_000);
    forcedShutdown.unref();

    for (const socket of connections) {
        if (!socket._isServing) {
            socket.destroy();
        }
    }

    try {
        await new Promise<void>((res, rej) => {
            server.close((err) => (err ? rej(err) : res()));
        });
        logger.info("HTTP zerbitzaria itzali da.");
    } catch (err) {
        logger.error("HTTP zerbitzaria itzaltzean errorea gertatu da: ", err);
    }

    tokenCleanupTask.stop();

    try {
        await mcpClient.closeConnection();
        logger.info("MCP konexioa itxi da.");
    } catch (err) {
        logger.error("MCP konexioa itxtean errorea gertatu da: ", err);
    }

    try {
        await db.$disconnect();
        logger.info("Datu-basearen erreserba itxi da.");
    } catch (err) {
        logger.error(
            "Datu-basearen erreserba ixtean errorea gertatu da: ",
            err,
        );
    }

    process.exit(0);
}

await checkDBConnection();

await mcpClient.connectToServer(environment.MCP_CODE_EXECUTION_SERVER_PATH);

const server = app.listen(environment.SERVER_PORT, handleListen);

const tokenCleanupTask = startTokenCleanup();

server.on("connection", handleConnection);

process.on("SIGTERM", () => shutdown(server, "SIGTERM"));
process.on("SIGINT", () => shutdown(server, "SIGINT"));
