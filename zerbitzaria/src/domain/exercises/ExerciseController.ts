import type { AuthenticatedRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";
import ExerciseService from "@domain/exercises/ExerciseService";
import {
    GetExerciseSchema,
    GetSpecificExerciseSchema,
    ListExercisesSchema
} from "@domain/exercises/local/types/schemas";
import { reqAuthenticated } from "@routers/middleware/authentication";

async function getExercise(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const verified = GetExerciseSchema.parse({
        params: req.params,
        query: req.query
    });
    const data = {
        ariketa_id: verified.params.ariketa_id,
        programazio_lengoaia_id: verified.query.programazio_lengoaia_id
    };
    const exercise = await ExerciseService.getExercise(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess(exercise));
}

async function getSpecificExercise(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const verified = GetSpecificExerciseSchema.parse({
        params: req.params,
        query: req.query
    });
    const data = {
        ariketa_id: verified.params.ariketa_id,
        programazio_lengoaia_id: verified.query.programazio_lengoaia_id
    };
    const exercise = await ExerciseService.getSpecificExercise(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess(exercise));
}

async function listExercises(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = ListExercisesSchema.parse(req.query);
    const exercises = await ExerciseService.listExercises(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess(exercises));
}

export default {
    getExercise: reqAuthenticated(getExercise),
    getSpecificExercise: reqAuthenticated(getSpecificExercise),
    listExercises: reqAuthenticated(listExercises)
} as const;
