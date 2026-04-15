import Paths from '@common/constants/Paths';
import AttemptController from '@domain/attempts/AttemptController';
import { Router } from 'express';

const attemptRouter = Router();

attemptRouter.get(Paths.Attempts.List, AttemptController.listAttempts)
attemptRouter.get(Paths.Attempts.View, AttemptController.getAttempt)
attemptRouter.post(Paths.Attempts.Send, AttemptController.submitAttempt)

export default attemptRouter;
