import type { AuthRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";

function sendMessage(_: AuthRequest, res: Response, _n: NextFunction): void {
    // TODO
    res.status(HttpStatusCode.NOT_IMPLEMENTED).send('TODO');
}

export default {
    sendMessage,
} as const;
