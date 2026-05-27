import type { Prisma, PrismaClient } from "@gral/datu-basea";
import type { Request } from "express";

interface AuthenticatedRequest extends Request {
    user: AuthUser;
}

interface AuthRequest extends Request {
    user?: AuthUser;
}

interface AuthUser {
    email: string;
    id: number;
}

type DbClient = Prisma.TransactionClient | PrismaClient;

interface IApiResponse<T = void> {
    data?: T;
    error?: string;
    issues?: {
        message: string;
        path: string;
    }[];
    success: boolean;
}

export type { AuthenticatedRequest, AuthRequest, DbClient, IApiResponse };
