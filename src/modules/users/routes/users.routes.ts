import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const usersRoutes = Router();

usersRoutes.get('/', UserController.getAllUsers);

export default usersRoutes;
