import { Request, Response, NextFunction } from 'express';

import * as UserModel from '../models/user.model';

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserModel.getAllUsers();

    res.json({
      users,
    });
  } catch (error) {
    next(error);
  }
};
