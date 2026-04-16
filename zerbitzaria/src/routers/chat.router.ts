import Paths from '@common/constants/Paths';
import ChatController from '@domain/chats/ChatController';
import { Router } from 'express';

import { authenticate } from './middleware/authentication';

const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.post(Paths.Chat.Message, ChatController.sendMessage);

export default chatRouter;
