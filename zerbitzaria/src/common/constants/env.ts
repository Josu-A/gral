import dotenv from 'dotenv';
import path from 'path';
import * as winston from 'winston';
import * as z from 'zod';

const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${env}`);

dotenv.config({ path: envPath });

const EnvironmentSchema = z.object({
    CLIENT_URL: z.union([
        z.httpUrl(),
        z.url({ hostname: /^localhost$/ })
    ]).default('http://localhost:8011'),
    LOG_LEVEL: z.enum(Object.keys(winston.config.npm.levels) as [string, ...string[]]).default('info'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
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
