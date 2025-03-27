import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const usersRoutes = Router();

// usersRoutes.get('/', UserController.searchUserByQuery);
usersRoutes.get('/', UserController.getAllUsers);

usersRoutes.get('/:id', UserController.getUserById);
usersRoutes.put('/:id', UserController.updateUserById);

export default usersRoutes;
