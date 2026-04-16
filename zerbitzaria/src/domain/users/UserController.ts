import type { AuthRequest } from "@common/types";
// validate input, pass to userservice, create a resonse
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";

function deleteAccount(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function deleteAttempts(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function deleteMessages(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function getProfile(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function updateEducation(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function updatePassword(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function updatePersonalData(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

export default {
    deleteAccount,
    deleteAttempts,
    deleteMessages,
    getProfile,
    updateEducation,
    updatePassword,
    updatePersonalData
} as const;
