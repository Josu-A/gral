import logger from "@common/constants/logger";
import db from "@infra/db";
import cron, { type ScheduledTask } from "node-cron";

const EXPIRED_TOKEN_AGE = 7 * 24 * 60 * 60 * 1000;

async function cleanRefreshTokens(): Promise<void> {
    try {
        const result = await db.freskatzeTokena.deleteMany({
            where: {
                iraungitutako_data: {
                    lt: new Date(Date.now() - EXPIRED_TOKEN_AGE),
                },
            },
        });
        logger.info(`Garbiketa: ${result.count} freskatze token ezabatu dira.`);
    } catch (err) {
        logger.error("Errorea freskatze tokenak garbitzean", err);
    }
}

function startTokenCleanup(): ScheduledTask {
    const task = cron.schedule("0 0 0 * * *", cleanRefreshTokens);
    cleanRefreshTokens();
    return task;
}

export { startTokenCleanup };
