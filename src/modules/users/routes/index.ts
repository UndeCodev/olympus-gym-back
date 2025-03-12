import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller';

const usersRoutes = Router();

usersRoutes.get('/profile', ProfileController.getUserProfile);
usersRoutes.put('/profile', ProfileController.updateUserProfile);

export default usersRoutes;
