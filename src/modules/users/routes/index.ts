import { Router } from 'express';
import usersRoutes from './users.routes';
import profileRoutes from './profile.routes';

const userRoutes = Router();

userRoutes.use('/profile', profileRoutes);
userRoutes.use('/', usersRoutes);

export default userRoutes;
