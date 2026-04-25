import type { AuthenticatedRequest } from "@common/types";
import type { CookieOptions, NextFunction, Request, Response } from "express";

import { environment } from "@common/constants/env";
import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatError, formatSuccess } from "@common/utils/responses";
import AuthService from "@domain/auth/AuthService";
import {
    LoginSchema,
    RegisterSchema,
    RequestPasswordRestoreSchema,
    RestorePasswordSchema
} from "@domain/auth/local/types/schemas";
import { reqAuthenticated } from "@routers/middleware/authentication";
import ms from 'ms';


const REFRESH_COOKIE_OPTS: CookieOptions = {
    httpOnly: true,
    maxAge: ms(environment.JWT_REFRESH_EXPIRATION),
    path: '/api/auth',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
};

async function login(
    req: Request,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = LoginSchema.parse(req.body);
    const result = await AuthService.login(data, req.ip, req.get('user-agent') ?? '');
    res.cookie('refresh_token', result.refreshToken, REFRESH_COOKIE_OPTS);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        accessToken: result.accessToken
    }));
}

async function logout(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
        await AuthService.logout(refreshToken);
    }
    res.clearCookie('refresh_token', { path: '/api/auth' });
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Saioa ondo itxi da'
    }));
}

async function refreshToken(
    req: Request,
    res: Response,
    _: NextFunction
): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
        res.status(HttpStatusCode.UNAUTHORIZED).json(formatError(
            'Ez da freskatze tokenik aurkitu'
        ));
        return;
    }
    const result = await AuthService.refreshToken(refreshToken, req.ip, req.get('user-agent') ?? '');
    res.cookie('refresh_token', result.refreshToken, REFRESH_COOKIE_OPTS);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        accessToken: result.accessToken
    }));
}

async function register(
    req: Request,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = RegisterSchema.parse(req.body);
    await AuthService.register(data);
    res.status(HttpStatusCode.CREATED).json(formatSuccess({
        message: 'Erabiltzailea ondo sortu da'
    }));
}

async function requestPasswordRestore(
    req: Request,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = RequestPasswordRestoreSchema.parse(req.body);
    await AuthService.requestPasswordRestore(data);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Pasahitza berrezartzeko argibideak helbide elektronikora bidali dira, baldin eta erabiltzailea existitzen bada'
    }));
}

async function restorePassword(
    req: Request,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = RestorePasswordSchema.parse(req.body);
    await AuthService.restorePassword(data);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'Pasahitza ondo berrezarri da'
    }));
}

async function verify(
    req: Request,
    res: Response,
    _: NextFunction
): Promise<void> {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

export default {
    login,
    logout: reqAuthenticated(logout),
    refreshToken,
    register,
    requestPasswordRestore,
    restorePassword,
    verify
} as const;
