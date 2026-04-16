import type { NextFunction, Request, Response } from "express";
import type { Socket } from "net";

declare module 'net' {
    interface Socket {
        _isServing?: boolean;
    }
}

const serverState = {
    isShuttingDown: false
}

const connections = new Set<Socket>();

function handleConnection(socket: Socket): void {
    connections.add(socket);
    socket.once('close', () => connections.delete(socket));
}

function handleConnectionClose(_: Request, res: Response, next: NextFunction): void {
    if (serverState.isShuttingDown) {
        res.setHeader('Connection', 'close');
    }
    next();
}

function handleRequestReceiving(req: Request, res: Response, next: NextFunction): void {
    req.socket._isServing = true;
    res.on('finish', () => {
        req.socket._isServing = false;
        if (serverState.isShuttingDown) {
            req.socket.destroy();
        }
    });
    next();
}

export {
    connections,
    handleConnection,
    handleConnectionClose,
    handleRequestReceiving,
    serverState
};
