import Paths from '@common/constants/Paths';
import DashboardController from '@domain/dashboard/DashboardController';
import { Router } from 'express';

import { authenticate } from './middleware/authentication';

const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get(Paths.Dashboard.View, DashboardController.getDashboard)

export default dashboardRouter;
