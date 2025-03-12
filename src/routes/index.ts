import { Router } from 'express';

import configRoutes from '../modules/configuration/routes';
import authRoutes from '../modules/auth/routes';
import { authenticateMiddleware } from '../middlewares/authenticate';

const router = Router();

router.use('/auth', authRoutes);
router.use('/config', authenticateMiddleware, configRoutes);

export default router;
