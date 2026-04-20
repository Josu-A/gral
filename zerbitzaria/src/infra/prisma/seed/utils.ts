import { environment } from '@common/constants/env';
import logger from '@common/constants/logger';
import { PrismaClient } from "@infra/prisma/generated/client"
import { PrismaPg } from '@prisma/adapter-pg';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: environment.DB_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter
});

function logSeedBody(body: string): void {
    logger.info(`  ${body}`);
}

function logSeedHeader(header: string): void {
    logger.info(`${header}:`);
}

async function readSeed(...paths: string[]): Promise<string> {
    const path = join(import.meta.dirname, ...paths);
    try {
        return await readFile(path, { encoding: 'utf8' });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : err;
        throw new Error(`Errorea '${path}' irakurtzean: ${msg}`, { cause: err });
    }
}

export {
    logSeedBody,
    logSeedHeader,
    pool,
    prisma,
    readSeed
};
