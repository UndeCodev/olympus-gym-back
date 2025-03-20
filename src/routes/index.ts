import { Router } from 'express';

import configRoutes from '../modules/configuration/routes';
import { faqsRouter } from '../modules/faqs/routes/faqs';

const router = Router();

router.use('/config', configRoutes);

router.use('/faqs/', faqsRouter)

export default router;
