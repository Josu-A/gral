import type { AuthenticatedRequest, AuthRequest } from '@common/types';
import type { NextFunction, Response } from 'express';

import { environment } from '@common/constants/env';
import HttpStatusCode from '@common/constants/HttpStatusCodes';
import { RequestError } from '@common/utils/errors';
import jwt, { type JwtPayload } from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jwt;

function authenticate(req: AuthRequest, _: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization || '';
    const [scheme, tokenFromHeader] = authHeader.split(' ');

    const tokenFromCookie = req.cookies?.access_token;

    const token = scheme === 'Bearer' && tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    if (!token) {
        next(new RequestError(HttpStatusCode.UNAUTHORIZED, "Kautotze burukorik ez"));
        return;
    }

    try {
        const decoded = jwt.verify(token, environment.JWT_ACCESS_SECRET) as JwtPayload;
        req.user = {
            email: decoded.email,
            id: decoded.id
        }
        next();
    }
    catch(err) {
        if (err instanceof TokenExpiredError) {
            next(new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena iraungi da"));
        }
        else if (err instanceof JsonWebTokenError) {
            next(new RequestError(HttpStatusCode.UNAUTHORIZED, "Tokena baliogabea da"));
        }
        else {
            next(err);
        }
    }
}

function hasUser(req: AuthRequest): req is AuthenticatedRequest {
    return Boolean(req.user);
}

function reqAuthenticated(
    handler: (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ) => Promise<unknown> | unknown
) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!hasUser(req)) {
            return next(new RequestError(HttpStatusCode.UNAUTHORIZED, "Kautotu gabea"));
        }
        return handler(req, res, next);
    };
}

export {
    authenticate,
    reqAuthenticated
};
