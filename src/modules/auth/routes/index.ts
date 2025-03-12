import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const authRoutes = Router();

authRoutes.post('/register', AuthController.createUser);
authRoutes.post('/login', AuthController.loginUser);
authRoutes.post('/logout', AuthController.logout);

authRoutes.put('/verify-email', AuthController.verifyEmail);
authRoutes.post('/resend-verification-email', AuthController.resendVerificationEmail);

authRoutes.post('/send-reset-password-email', AuthController.sendResetPasswordEmail);
authRoutes.post('/set-new-password', AuthController.setNewPassword);

export default authRoutes;
