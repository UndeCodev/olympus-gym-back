import { Router } from 'express';
import usersRoutes from './users.routes';
import profileRoutes from './profile.routes';

const userRoutes = Router();

userRoutes.use('/', usersRoutes);
userRoutes.use('/profile', profileRoutes);

export default userRoutes;
