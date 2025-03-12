import { Request, Response, NextFunction } from 'express';

import * as ProfileModel from '../models/profile.model';

export const getUserProfile = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.userId;

    const userFound = await ProfileModel.getUserProfile(userId);

    res.json({
      userFound,
    });
  } catch (error) {
    next(error);
  }
};
