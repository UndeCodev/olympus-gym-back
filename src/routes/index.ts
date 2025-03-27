import { Router } from 'express';

import { authenticateMiddleware } from '../middlewares/authenticate';

import configRoutes from '../modules/configuration/routes';
import authRoutes from '../modules/auth/routes';
import usersRoutes from '../modules/users/routes';
import securityQuestionRouter from '../modules/security_question/routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/config', authenticateMiddleware, configRoutes);
router.use('/users', authenticateMiddleware, usersRoutes);
router.use('/security-questions', securityQuestionRouter);

export default router;
