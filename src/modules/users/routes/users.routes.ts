import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const usersRoutes = Router();

usersRoutes.get('/', UserController.getAllUsers);
usersRoutes.get('/:id', UserController.getUserById);

export default usersRoutes;
