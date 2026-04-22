import type { AuthenticatedRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";
import {
    UpdateEducationSchema,
    UpdatePasswordSchema,
    UpdatePersonalDataSchema
} from "@domain/users/local/types/schemas";
import UserService from "@domain/users/UserService";
import { reqAuthenticated } from "@routers/middleware/authentication";

async function deleteAccount(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    await UserService.deleteAccount(req.user.id);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Kontua ezabatu da'
    }));
}

async function deleteAttempts(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    await UserService.deleteAttempts(req.user.id);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Saiakera guztiak ezabatu dira'
    }));
}

async function deleteMessages(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    await UserService.deleteMessages(req.user.id);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Mezu guztiak ezabatu dira'
    }));
}

async function getProfile(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const profile = await UserService.getProfile(req.user.id);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        profile
    }));
}

async function updateEducation(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = UpdateEducationSchema.parse(req.body);
    const updatedData = await UserService.updateEducation(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        updatedData
    }));
}

async function updatePassword(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = UpdatePasswordSchema.parse(req.body);
    await UserService.updatePassword(req.user.id, data);
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Pasahitza eguneratu da, saioa berriro hasi ezazu'
    }));
}

async function updatePersonalData(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = UpdatePersonalDataSchema.parse(req.body);
    const updatedData = await UserService.updatePersonalData(req.user.id, data);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        updatedData
    }));
}

export default {
    deleteAccount: reqAuthenticated(deleteAccount),
    deleteAttempts: reqAuthenticated(deleteAttempts),
    deleteMessages: reqAuthenticated(deleteMessages),
    getProfile: reqAuthenticated(getProfile),
    updateEducation: reqAuthenticated(updateEducation),
    updatePassword: reqAuthenticated(updatePassword),
    updatePersonalData: reqAuthenticated(updatePersonalData)
} as const;
