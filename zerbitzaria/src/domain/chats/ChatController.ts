import type { AuthenticatedRequest } from "@common/types";
import type { NextFunction, Response } from "express";

import HttpStatusCode from "@common/constants/HttpStatusCodes";
import { formatSuccess } from "@common/utils/responses";
import ChatService from "@domain/chats/ChatService";
import { reqAuthenticated } from "@routers/middleware/authentication";

import { GetMessagesSchema, SendMessageSchema } from "./local/types/schemas";

async function getMessages(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const query = GetMessagesSchema.parse(req.query);
    const messages = await ChatService.getMessages(req.user.id, query);
    res.status(HttpStatusCode.OK).json(formatSuccess({
        messages
    }));
}

async function sendMessage(
    req: AuthenticatedRequest,
    res: Response,
    _: NextFunction
): Promise<void> {
    const data = SendMessageSchema.parse(req.body);
    const result = await ChatService.sendMessage(req.user.id, data);
    res.status(HttpStatusCode.CREATED).json(formatSuccess({
        message: result
    }));
}

export default {
    getMessages: reqAuthenticated(getMessages),
    sendMessage: reqAuthenticated(sendMessage)
} as const;
