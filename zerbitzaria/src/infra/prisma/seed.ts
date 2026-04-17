import { environment } from "@common/constants/env";
import logger from "@common/constants/logger";
import { PrismaClient } from "@infra/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: environment.DB_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter
});

async function main() {
}

main().then(async () => {
    await prisma.$disconnect();
    await pool.end();
}).catch(async (err) => {
    logger.error("Ezin izan da seeda sartu datu-basean:", err)
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
});
