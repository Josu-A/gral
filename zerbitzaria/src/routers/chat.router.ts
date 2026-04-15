import Paths from '@common/constants/Paths';
import ChatController from '@domain/chats/ChatController';
import { Router } from 'express';

const chatRouter = Router();

chatRouter.post(Paths.Chat.Message, ChatController.sendMessage);

export default chatRouter;
