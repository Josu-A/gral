import Paths from "@common/constants/Paths";
import AuthController from "@domain/auth/AuthController";
import {
    authLimiter,
    restorePasswordLimiter,
} from "@routers/middleware/rateLimiters";
import { Router } from "express";

const authRouter = Router();

authRouter.post(Paths.Auth.Register, authLimiter, AuthController.register);
authRouter.post(Paths.Auth.Verify, authLimiter, AuthController.verify);
authRouter.post(Paths.Auth.Login, authLimiter, AuthController.login);
authRouter.post(Paths.Auth.Logout, AuthController.logout);
authRouter.post(Paths.Auth.Refresh, AuthController.refreshToken);
authRouter.post(
    Paths.Auth.RequestPasswordRestore,
    restorePasswordLimiter,
    AuthController.requestPasswordRestore,
);
authRouter.post(
    Paths.Auth.RestorePassword,
    restorePasswordLimiter,
    AuthController.restorePassword,
);

export default authRouter;
