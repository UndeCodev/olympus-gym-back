import { Router } from 'express';

import configRoutes from '../modules/configuration/routes';

const router = Router();

router.use('/config', configRoutes);

export default router;
