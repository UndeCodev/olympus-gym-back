import { Request, Response, NextFunction } from 'express';

import * as ProfileModel from '../models/profile.model';
import { zodValidation } from '../../../utils/zodValidation';
import { currentPasswordSchema, userProfileSchema } from '../schemas/user.schema';
import { HttpCode } from '../../../common/enums/HttpCode';
import bcrypt from 'bcrypt';

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

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(userProfileSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const userId = res.locals.userId;

    console.log(resultValidation.data);

    // TODO: Implement an additional verification process, when the user change the email, similar to the one you perform when a user registers for the first time.
    const profileUpdated = await ProfileModel.updateUserProfile(resultValidation.data, userId);

    res.json({
      profileUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = res.locals.userId;

  const resultValidation = zodValidation(currentPasswordSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  const { password: currentPassword } = resultValidation.data;

  try {
    const userFound = await ProfileModel.getUserByIdWithPassword(userId);

    const isPasswordValid = await bcrypt.compare(currentPassword, userFound.password);

    if (!isPasswordValid) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: 'Contraseña incorrecta.',
      });
      return;
    }

    await ProfileModel.deleteUserProfile(userId);
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.json({
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
