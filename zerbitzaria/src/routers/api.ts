import Paths from "@common/constants/Paths";
import attemptRouter from "@routers/attempt.router";
import authRouter from "@routers/auth.router";
import chatRouter from "@routers/chat.router";
import dashboardRouter from "@routers/dashboard.router";
import exerciseRouter from "@routers/exercise.router";
import healthRouter from "@routers/health.router";
import userRouter from "@routers/user.router";
import { Router } from "express";

const apiRouter = Router();

apiRouter.use(Paths.Attempts.Base, attemptRouter);
apiRouter.use(Paths.Auth.Base, authRouter);
apiRouter.use(Paths.Chat.Base, chatRouter);
apiRouter.use(Paths.Dashboard.Base, dashboardRouter);
apiRouter.use(Paths.Exercises.Base, exerciseRouter);
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Health.Base, healthRouter);

export default apiRouter;
