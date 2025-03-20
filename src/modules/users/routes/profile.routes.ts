import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller';

const profileRoutes = Router();

profileRoutes.get('/', ProfileController.getUserProfile);
profileRoutes.put('/', ProfileController.updateUserProfile);
profileRoutes.delete('/', ProfileController.deleteUserProfile);

export default profileRoutes;
