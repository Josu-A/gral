import type { Request } from "express";

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
    AuthRequest,
    IApiResponse
};
