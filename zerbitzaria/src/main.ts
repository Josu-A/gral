import type { NextFunction, Request, Response } from 'express';

import { Server } from 'http';
import { Socket } from 'net';

import app from './app';
import { environment } from './common/constants/env';
import logger from './common/constants/logger';
import { isErrno } from './common/utils/errors';

declare module 'net' {
    interface Socket {
        _isServing?: boolean;
    }
}

const connections = new Set<Socket>();
let isShuttingDown = false;

function handleConnection(socket: Socket): void {
    connections.add(socket);
    socket.once('close', () => connections.delete(socket));
}

function handleConnectionClose(_: Request, res: Response, next: NextFunction): void {
    if (isShuttingDown) {
        res.setHeader('Connection', 'close');
    }
    next();
}

function handleListen(error?: Error): void {
    if (error) {
        if (isErrno(error)) {
            switch (error.code) {
                case 'EACCES':
                    logger.error("Zehaztutako ataka erabiltzeko baimenik ez du");
                    break;
                case 'EADDRINUSE':
                    logger.error("Zehaztutako ataka jada beste zerbitzari batek erabiltzen ari da");
                    break;
                default:
                    logger.error(`Zerbitzarian ${error.code} errorea gertatu da: ${error.message}`);
            }
        }
        else {
            logger.error(`Zerbitzarian errore bat gertatu da: ${error.message}`);
        }
        process.exit(1);
    }
    logger.info(`Zerbitzaria ${environment.SERVER_PORT} portuan entzuten.`);
}

function handleRequestReceiving(req: Request, res: Response, next: NextFunction): void {
    req.socket._isServing = true;
    res.on('finish', () => {
        req.socket._isServing = false;
        if (isShuttingDown) {
            req.socket.destroy();
        }
    });
    next();
}

async function shutdown(server: Server, signal: string): Promise<void> {
    if (isShuttingDown) {
        return;
    }
    isShuttingDown = true;

    logger.info(`${signal} seinalea jaso da, zerbitzaria itzaltzen...`);

    for (const socket of connections) {
        if (!socket._isServing) {
            socket.destroy();
        }
    }

    server.close(async () => {
        logger.info("HTTP zerbitzaria itzali da.");
        process.exit(0);
    });

    const forcedShutdown = setTimeout(() => {
        logger.error("Zerbitzaria ezin izan da denbora mugan itzali, behartu egingo da.");
        process.exit(1);
    }, 10_000);
    forcedShutdown.unref();
}

const server = app.listen(environment.SERVER_PORT, handleListen);

server.on('connection', handleConnection);

app.use(handleRequestReceiving);
app.use(handleConnectionClose);

process.on('SIGTERM', () => shutdown(server, 'SIGTERM'));
process.on('SIGINT', () => shutdown(server, 'SIGINT'));
