import type { AuthRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";

function getAttempt(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function listAttempts(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function submitAttempt(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

export default {
    getAttempt,
    listAttempts,
    submitAttempt
} as const;
