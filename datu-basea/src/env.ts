import dotenv from "dotenv";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "path";
import * as winston from "winston";
import * as z from "zod";

function findPackageDir(): string {
    let dir = path.dirname(fileURLToPath(import.meta.url));
    while (true) {
        const packageJsonExists = fs.existsSync(path.join(dir, "package.json"));
        if (packageJsonExists) {
            return dir;
        }
        const parentDir = path.dirname(dir);
        if (parentDir === dir) {
            throw new Error("No package.json found in any parent directory.");
        }
        dir = parentDir;
    }
}

const pkgDir = findPackageDir();
const monorepoRootDir = path.resolve(pkgDir, "..");
const env = process.env.NODE_ENV || "production";
const envPath = path.resolve(monorepoRootDir, `.env.${env}`);

dotenv.config({
    path: envPath,
    quiet: true,
});

const EnvironmentSchema = z.object({
    DB_URL: z
        .string()
        .default("postgresql://postgres:@localhost:5432/gral?schema=public"),
    LOG_LEVEL: z
        .enum(Object.keys(winston.config.npm.levels) as [string, ...string[]])
        .default("info"),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
});

function validateEnvironment() {
    try {
        return EnvironmentSchema.parse(process.env);
    } catch (err) {
        console.error("Ingurune aldagaiek eskema okerra dute.");
        if (err instanceof z.ZodError) {
            for (const issue of err.issues) {
                console.error(issue);
            }
        }
        process.exit(1);
    }
}
// we access process.env once and cache it, much faster
export const environment = validateEnvironment();
export type Environment = z.infer<typeof EnvironmentSchema>;
