import { Request, Response, NextFunction } from 'express';

import * as ProfileModel from '../models/profile.model';
import { zodValidation } from '../../../utils/zodValidation';
import { userProfileSchema } from '../schemas/user.schema';
import { HttpCode } from '../../../common/enums/HttpCode';

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

    // TODO: Implement an additional verification process, when the user change the email, similar to the one you perform when a user registers for the first time.
    const userProfileUpdated = await ProfileModel.updateUserProfile(resultValidation.data, userId);

    res.json({
      userProfileUpdated,
    });
  } catch (error) {
    next(error);
  }
};
