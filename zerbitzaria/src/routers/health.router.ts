import Paths from '@common/constants/Paths';
import HealthController from '@domain/health/HealthController';
import { Router } from 'express';

const healthRouter = Router();

healthRouter.use(Paths.Health.Check, HealthController.healthCheck);

export default healthRouter;
