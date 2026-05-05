type LogLevel = "error" | "info" | "warn";

function error(message: string, ...args: unknown[]): void {
    log("error", message, ...args);
}

function info(message: string, ...args: unknown[]): void {
    log("info", message, ...args);
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.error(formattedMessage, ...args);
}

function warn(message: string, ...args: unknown[]): void {
    log("warn", message, ...args);
}

const logger = {
    error,
    info,
    warn,
} as const;

export default logger;
