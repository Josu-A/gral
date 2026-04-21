import type { Request } from "express";

interface AuthenticatedRequest extends Request {
    user: AuthUser;
};

interface AuthRequest extends Request {
    user?: AuthUser;
};

interface AuthUser {
    email: string;
    id: number;
};

interface IApiResponse<T = void> {
    data?: T;
    error?: string;
    success: boolean;
};

export type {
    AuthenticatedRequest,
    AuthRequest,
    IApiResponse
};
