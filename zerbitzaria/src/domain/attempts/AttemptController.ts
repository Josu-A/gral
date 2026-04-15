import type { NextFunction, Request, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";

function getAttempt(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function listAttempts(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function submitAttempt(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

export default {
    getAttempt,
    listAttempts,
    submitAttempt
} as const;
