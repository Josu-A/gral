import type { Request, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";

function healthCheck(_: Request, res: Response): void {
    res.status(HttpStatusCode.OK).json(formatSuccess({
        message: 'ok',
        responsetime: process.hrtime(),
        timestamp: Date.now(),
        uptime: process.uptime()
    }));
}

export default {
    healthCheck
} as const;
