import dotenv from 'dotenv';
import ms, { type StringValue } from 'ms';
import path from 'path';
import * as winston from 'winston';
import * as z from 'zod';

const env = process.env.NODE_ENV || 'production';
const envPath = path.resolve(process.cwd(), `.env.${env}`);

dotenv.config({ path: envPath });

const JwtDurationSchema = z.string()
    .refine(val => ms(val as StringValue) !== undefined, {
        error: "JWT freskatze denbora okerra da"
    }).transform(val => val as StringValue);

const EnvironmentSchema = z.object({
    CLIENT_URL: z.union([
        z.httpUrl(),
        z.url({ hostname: /^localhost$/ })
    ]).default('http://localhost:8011'),
    DB_URL: z.string().default('postgresql://postgres:@localhost:5432/gral?schema=public'),
    JWT_ACCESS_EXPIRATION: JwtDurationSchema.default('15min'),
    JWT_ACCESS_SECRET: z.string().min(64, {
        error: "JWT sarbide sekretuak gutxienez 64 karaktere izan behar ditu"
    }),
    JWT_REFRESH_EXPIRATION: JwtDurationSchema.default('14d'),
    JWT_REFRESH_SECRET: z.string().min(64, {
        error: "JWT freskatze sekretuak gutxienez 64 karaktere izan behar ditu"
    }),
    LOG_LEVEL: z.enum(Object.keys(winston.config.npm.levels) as [string, ...string[]]).default('info'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    SALT_ROUNDS: z.coerce.number<number>().default(10),
    SERVER_PORT: z.coerce.number<number>().default(3000)
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
