import Paths from "@common/constants/Paths";
import ChatController from "@domain/chats/ChatController";
import { authenticate } from "@routers/middleware/authentication";
import { Router } from "express";

const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.get(Paths.Chat.Message, ChatController.getMessages);
chatRouter.post(Paths.Chat.Message, ChatController.sendMessage);

export default chatRouter;
