import Paths from "@common/constants/Paths";
import DashboardController from "@domain/dashboard/DashboardController";
import { authenticate } from "@routers/middleware/authentication";
import { Router } from "express";

const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get(Paths.Dashboard.View, DashboardController.getDashboard);

export default dashboardRouter;
