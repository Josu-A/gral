import Paths from '@common/constants/Paths';
import AuthController from '@domain/auth/AuthController';
import { authLimiter, restorePasswordLimiter } from '@routers/middleware/rateLimiters';
import { Router } from 'express';

const authRouter = Router();

authRouter.use(authLimiter);

authRouter.post(Paths.Auth.Register, AuthController.register);
authRouter.post(Paths.Auth.Verify, AuthController.verify);
authRouter.post(Paths.Auth.Login, AuthController.login);
authRouter.post(Paths.Auth.Logout, AuthController.logout);
authRouter.post(Paths.Auth.Refresh, AuthController.refreshToken);
authRouter.post(Paths.Auth.RequestPasswordRestore, restorePasswordLimiter, AuthController.requestPasswordRestore);
authRouter.post(Paths.Auth.RestorePassword, restorePasswordLimiter, AuthController.restorePassword);

export default authRouter;
