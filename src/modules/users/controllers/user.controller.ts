import { Request, Response, NextFunction } from 'express';

import * as UserModel from '../models/user.model';
import { zodValidation } from '../../../utils/zodValidation';
import { updateUserSchema, userIdSchema } from '../schemas/user.schema';
import { HttpCode } from '../../../common/enums/HttpCode';
import { userSearchSchema } from '../schemas/userSearchSchema';

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await UserModel.getAllUsers();

    console.log(users);

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

    const user = await UserModel.findUserByIdWithoutSensitiveData(id);

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUserByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(userSearchSchema, req.query);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const { name, email, phoneNumber } = resultValidation.data;

    const users = await UserModel.searchUserByQuery(name, email, phoneNumber);

    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultUserIdValidation = zodValidation(userIdSchema, req.params);

  if (!resultUserIdValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultUserIdValidation.error.format(),
    });
    return;
  }

  const resultDataValidation = zodValidation(updateUserSchema, req.body);

  if (!resultDataValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultDataValidation.error.format(),
    });
    return;
  }

  try {
    const { id } = resultUserIdValidation.data;

    console.log(id);
    console.log(resultDataValidation.data);

    // TODO: Implement reverification before update [Role and Birthdate] -> send TOTP, [Email] -> send email verification
    const userUpdated = await UserModel.updateUserDetails(id, resultDataValidation.data);

    // console.log(userUpdated);

    res.json({
      userUpdated,
    });
  } catch (error) {
    next(error);
  }
};
