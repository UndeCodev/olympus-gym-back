import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticateMiddleware } from '../../../middlewares/authenticate';

const authRoutes = Router();

// Check if user is authenticated
authRoutes.get('/check-status', authenticateMiddleware, AuthController.checkAuthStatus);

authRoutes.post('/register', AuthController.createUser);
authRoutes.post('/login', AuthController.loginUser);
authRoutes.post('/logout', AuthController.logout);

authRoutes.put('/verify-email', AuthController.verifyEmail);
authRoutes.post('/resend-verification-email', AuthController.resendVerificationEmail);

authRoutes.post('/send-reset-password-email', AuthController.sendResetPasswordEmail);
authRoutes.post('/set-new-password', AuthController.setNewPassword);

authRoutes.post('/2fa/setup', authenticateMiddleware, AuthController.setup2FA);
authRoutes.post('/2fa/verify', authenticateMiddleware, AuthController.verify2FA);
authRoutes.post('/2fa/disable', authenticateMiddleware, AuthController.disable2FA);

export default authRoutes;
