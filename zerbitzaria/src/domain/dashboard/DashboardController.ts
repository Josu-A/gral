import type { AuthenticatedRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";
import DashboardService from "@domain/dashboard/DashboardService";
import { reqAuthenticated } from "@routers/middleware/authentication";

async function getDashboard(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = await DashboardService.getDashboard(req.user.id);
    res.status(HttpStatusCode.OK).json(formatSuccess(data));
}

export default {
    getDashboard: reqAuthenticated(getDashboard),
} as const;
