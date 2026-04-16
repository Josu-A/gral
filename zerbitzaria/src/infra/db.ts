import { environment } from '@common/constants/env';
import logger from '@common/constants/logger';
import { Pool, type PoolClient, type PoolOptions } from 'pg';

const poolOptions: PoolOptions = {
    allowExitOnIdle: false,
    connectionTimeoutMillis: 2_000,
    database: environment.DB_DATABASE,
    host: environment.DB_HOST,
    idleTimeoutMillis: 30_000,
    max: 20,
    maxLifetimeSeconds: 0,
    maxUses: Infinity,
    password: environment.DB_PASSWORD,
    port: environment.DB_PORT,
    user: environment.DB_USER
};

const pool = new Pool(poolOptions);

async function checkDBConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT $1::text as message', ['Kaixo mundua!']);
            logger.info(`Datu-basetik mezua dator: ${res.rows[0].message}`)
        }
        finally {
            client.release();
        }
    }
    catch(err) {
        logger.error("Ezin izan da datu-basearekin konektatu:", err);
        process.exit(1);
    }
}

function onConnect(): void {
    logger.info("Zerbitzaria datu-basera konektatu da.");
}

function onError(err: Error, _: PoolClient): void {
    logger.error("Datu-baseko konexioan errorea gertatu da.", {
        error: err.message
    });
    process.exit(-1);
}

pool.on('connect', onConnect);
pool.on('error', onError);

export default pool;
export { checkDBConnection };
