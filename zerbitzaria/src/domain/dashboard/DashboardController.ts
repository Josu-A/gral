import type { AuthenticatedRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";
import DashboardService from "@domain/dashboard/DashboardService";
import { GetDashboardSchema } from "@domain/dashboard/local/types/schemas";
import { reqAuthenticated } from "@routers/middleware/authentication";

async function getDashboard(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction,
): Promise<void> {
    const parsedData = GetDashboardSchema.parse(req.query);
    const data = await DashboardService.getDashboard(req.user.id, parsedData);
    res.status(HttpStatusCode.OK).json(formatSuccess(data));
}

export default {
    getDashboard: reqAuthenticated(getDashboard),
} as const;
