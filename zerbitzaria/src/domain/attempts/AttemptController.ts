import type { AuthenticatedRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";
import AttemptService from "@domain/attempts/AttemptService";
import {
    GetAttemptSchema,
    ListAttemptsSchema,
    SolutionSaveSchema,
} from "@domain/attempts/local/types/schemas";
import { reqAuthenticated } from "@routers/middleware/authentication";

async function getAttempt(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction,
): Promise<void> {
    const verified = GetAttemptSchema.parse({
        params: req.params,
    });
    const data = {
        saiakera_id: verified.params.saiakera_id,
    };
    const attempt = await AttemptService.getAttempt(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess(attempt));
}

async function listAttempts(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction,
): Promise<void> {
    const verified = ListAttemptsSchema.parse({
        query: req.query,
    });
    const data = {
        ariketa_id: verified.query.ariketa_id,
    };
    const attempts = await AttemptService.listAttempts(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess(attempts));
}

async function saveSolution(
    req: AuthenticatedRequest,
    res: Response,
    _n: NextFunction,
): Promise<void> {
    const data = SolutionSaveSchema.parse(req.body);
    await AttemptService.saveSolution(req.user.id, data);
    res.status(HttpStatusCode.OK).json(
        formatSuccess({
            message: "Ebazpena gorde da",
        }),
    );
}

function submitAttempt(
    _: AuthenticatedRequest,
    res: Response,
    _n: NextFunction,
): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send("TODO");
}

export default {
    getAttempt: reqAuthenticated(getAttempt),
    listAttempts: reqAuthenticated(listAttempts),
    saveSolution: reqAuthenticated(saveSolution),
    submitAttempt: reqAuthenticated(submitAttempt),
} as const;
