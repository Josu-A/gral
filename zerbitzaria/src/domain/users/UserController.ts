// validate input, pass to userservice, create a resonse
import type { NextFunction, Request, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";

function deleteAccount(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function deleteAttempts(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function deleteMessages(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function getProfile(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function updateEducation(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function updatePassword(_: Request, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function updatePersonalData(_: Request, res: Response, _n: NextFunction): void {
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
