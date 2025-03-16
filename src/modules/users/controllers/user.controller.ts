import { Request, Response, NextFunction } from 'express';

import * as UserModel from '../models/user.model';
import { zodValidation } from '../../../utils/zodValidation';
import { userIdSchema } from '../schemas/user.schema';
import { HttpCode } from '../../../common/enums/HttpCode';

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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(userIdSchema, req.params);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const { id } = resultValidation.data;

    const user = await UserModel.findUserByIdWithoutPassword(id);

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};
