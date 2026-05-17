import { environment } from "@common/constants/env";
import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { colorize, combine, errors, json, printf, timestamp } = winston.format;

const TIMESTAMP_STYLE = "YYYY-MM-DD HH:mm:ss";

const consoleFormat = combine(
    colorize(),
    timestamp({ format: TIMESTAMP_STYLE }),
    printf(({ level, message, stack, timestamp, ...extra }) => {
        const msg = stack || message;
        const log = `${timestamp} ${level}: ${msg ? " " + msg : ""}`;
        const extraString = Object.keys(extra).length
            ? ` ${Object.values(extra).join(" ")}`
            : "";
        return `[Backend] ${log}${extraString}`;
    }),
);

const fileFormat = combine(
    timestamp({ format: TIMESTAMP_STYLE }),
    errors({ stack: true }),
    json(),
);

function createDailyRotateFileTransport(
    dirname: string,
    filename: string,
    level?: string,
): DailyRotateFile {
    return new DailyRotateFile({
        datePattern: "YYYY-MM-DD-HH",
        dirname: `./logs/${dirname}`,
        filename: `%DATE%_${filename}.log`,
        format: fileFormat,
        level,
        maxFiles: "14d",
        maxSize: "5m",
        zippedArchive: true,
    });
}

const winstonTransports: winston.transport[] = [
    createDailyRotateFileTransport("combined", "combined"),
    createDailyRotateFileTransport("errors", "error", "error"),
];

if (environment.NODE_ENV !== "production") {
    const consoleTransport = new winston.transports.Console({
        format: consoleFormat,
    });
    winstonTransports.push(consoleTransport);
}

const logger = winston.createLogger({
    exceptionHandlers: [
        createDailyRotateFileTransport("exceptions", "exceptions"),
    ],
    level: environment.LOG_LEVEL,
    rejectionHandlers: [
        createDailyRotateFileTransport("rejections", "rejections"),
    ],
    transports: winstonTransports,
});

export default logger;
