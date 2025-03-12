import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller';

const usersRoutes = Router();

usersRoutes.get('/profile', ProfileController.getUserProfile);

export default usersRoutes;
