import { Router } from 'express';

import configRoutes from '../modules/configuration/routes';
import authRoutes from '../modules/auth/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/config', configRoutes);

export default router;
