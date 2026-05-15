import Paths from "@common/constants/Paths";
import ChatController from "@domain/chats/ChatController";
import { authenticate } from "@routers/middleware/authentication";
import { Router } from "express";

const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get(Paths.Chat.Messages, ChatController.getMessages);
chatRouter.post(Paths.Chat.Send, ChatController.sendMessage);

export default chatRouter;
