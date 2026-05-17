import { PrismaPg } from "@prisma/adapter-pg";

import type { LogEvent } from "./generated/internal/prismaNamespace";

import { environment } from "./env";
import { PrismaClient } from "./generated/client";
import logger from "./logger";

const adapter = new PrismaPg({
    connectionString: environment.DB_URL,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 10_000,
    max: 10,
    maxLifetimeSeconds: 0,
});

const db = new PrismaClient({
    adapter: adapter,
    log: [
        {
            emit: "event",
            level: "error",
        },
    ],
});

async function checkDBConnection(): Promise<void> {
    try {
        const res = await db.$queryRaw<
            [{ message: string }]
        >`SELECT ${"Kaixo mundua!"}::text as message`;
        logger.info(`Datu-basetik mezua dator: ${res[0].message}`);
        logger.info("Zerbitzaria datu-basera konektatu da.");
    } catch (err) {
        logger.error("Ezin izan da datu-basearekin konektatu:", err);
        process.exit(1);
    }
}

function onError(event: LogEvent): void {
    logger.error("Datu-baseko konexioan errorea gertatu da.", {
        error: event.message || event,
    });
    process.exit(-1);
}

db.$on("error", onError);

export default db;
export { checkDBConnection };
