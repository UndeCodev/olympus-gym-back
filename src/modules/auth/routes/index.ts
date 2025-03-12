import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const authRoutes = Router();

authRoutes.post('/register', AuthController.createUser);
authRoutes.post('/login', AuthController.loginUser);
authRoutes.post('/logout', AuthController.logout);

authRoutes.put('/verify-email', AuthController.verifyEmail);
authRoutes.post('/resend-verification-email', AuthController.resendVerificationEmail);

export default authRoutes;
