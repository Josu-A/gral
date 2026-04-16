import type { AuthRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";

function getExercise(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function getSpecificExercise(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

function listExercises(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

export default {
    getExercise,
    getSpecificExercise,
    listExercises
} as const;
