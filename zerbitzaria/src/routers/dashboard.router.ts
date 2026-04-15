import Paths from '@common/constants/Paths';
import DashboardController from '@domain/dashboard/DashboardController';
import { Router } from 'express';

const dashboardRouter = Router();

dashboardRouter.get(Paths.Dashboard.View, DashboardController.getDashboard)

export default dashboardRouter;
