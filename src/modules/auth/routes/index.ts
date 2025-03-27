import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticateMiddleware } from '../../../middlewares/authenticate';

const authRoutes = Router();

authRoutes.post('/register', AuthController.createUser);
authRoutes.post('/login', AuthController.loginUser);
authRoutes.post('/logout', AuthController.logout);

authRoutes.put('/verify-email', AuthController.verifyEmail);
authRoutes.post('/resend-verification-email', AuthController.resendVerificationEmail);

authRoutes.post('/send-reset-password-email', AuthController.sendResetPasswordEmail);
authRoutes.put('/set-new-password', AuthController.setNewPassword);

// Check if user is authenticated
authRoutes.get('/check-status', authenticateMiddleware, AuthController.checkAuthStatus);

// All this routes needs a user authenticated
authRoutes.put('/change-password', authenticateMiddleware, AuthController.changePassword);

authRoutes.post('/2fa/verify', AuthController.verify2FA);

authRoutes.post('/2fa/setup', authenticateMiddleware, AuthController.setup2FA);
authRoutes.post('/2fa/disable', authenticateMiddleware, AuthController.disable2FA);

authRoutes.post('/check-security-question', AuthController.checkSecurityQuestion);

export default authRoutes;
