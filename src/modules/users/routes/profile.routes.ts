import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller';

const profileRoutes = Router();

profileRoutes.get('/profile', ProfileController.getUserProfile);
profileRoutes.put('/profile', ProfileController.updateUserProfile);
profileRoutes.delete('/profile', ProfileController.deleteUserProfile);

export default profileRoutes;
