import dotenv from "dotenv";
import ms, { type StringValue } from "ms";
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

const JwtDurationSchema = z
    .string()
    .refine((val) => ms(val as StringValue) !== undefined, {
        error: "JWT freskatze denbora okerra da",
    })
    .transform((val) => val as StringValue);

const EnvironmentSchema = z.object({
    API_KEY_LATXA: z.string().min(1, {
        error: "Latxa API gakoa beharrezkoa da",
    }),
    API_MODEL_LATXA: z.string().min(1, {
        error: "Latxa API modeloa beharrezkoa da",
    }),
    API_URL_LATXA: z.url(),
    CLIENT_PORT: z.coerce.number<number>().default(5173),
    CLIENT_URL: z
        .union([z.httpUrl(), z.url({ hostname: /^localhost$/ })])
        .default("http://localhost:5173"),
    DOCKER_HOST: z.string().optional(),
    JWT_ACCESS_EXPIRATION: JwtDurationSchema.default("15min"),
    JWT_ACCESS_SECRET: z.string().min(64, {
        error: "JWT sarbide sekretuak gutxienez 64 karaktere izan behar ditu",
    }),
    JWT_REFRESH_EXPIRATION: JwtDurationSchema.default("14d"),
    JWT_REFRESH_SECRET: z.string().min(64, {
        error: "JWT freskatze sekretuak gutxienez 64 karaktere izan behar ditu",
    }),
    LOG_LEVEL: z
        .enum(Object.keys(winston.config.npm.levels) as [string, ...string[]])
        .default("info"),
    MCP_CODE_EXECUTION_SERVER_PATH: z
        .string()
        .min(1, {
            error: "MCP kode exekuzio zerbitzariaren bidea beharrezkoa da",
        })
        .transform((val) => path.resolve(monorepoRootDir, val))
        .default("mcp/code-execution/dist/index.js"),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    SALT_ROUNDS: z.coerce.number<number>().default(10),
    SERVER_PORT: z.coerce.number<number>().default(3000),
    VITE_BASE_API_PATH: z.string().default("/api"),
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
