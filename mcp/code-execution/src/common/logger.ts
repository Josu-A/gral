type LogLevel = "error" | "info" | "warn";

const colors = {
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    reset: "\x1b[0m",
    yellow: "\x1b[33m",
} as const;

const levelColors: Record<LogLevel, string> = {
    error: colors.red,
    info: colors.cyan,
    warn: colors.yellow,
};

function error(message: string, ...args: unknown[]): void {
    log("error", message, ...args);
}

function formatDate(date: Date): string {
    const pad = (num: number): string => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function info(message: string, ...args: unknown[]): void {
    log("info", message, ...args);
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
    const timestamp = formatDate(new Date());
    const color = levelColors[level];
    const formattedMessage = `[MCP Code Execution] ${timestamp} ${color}${level}${colors.reset}: ${message}`;
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
