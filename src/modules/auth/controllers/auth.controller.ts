import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import * as UserModel from '../../users/models/user.model';

import { JWT_SECRET, NODE_ENV } from '../../../config/env';
import { HttpCode } from '../../../common/enums/HttpCode';
import {
  registerSchema,
  loginSchema,
  justUserEmailSchema,
  tokenAndNewPasswordSchema,
  verifyEmailSchema,
} from '../schemas/auth.schema';

import { AppError } from '../../../exceptions/AppError';
import { sendEmail } from '../../../services/mailService';
import { zodValidation } from '../../../utils/zodValidation';

interface TokenPayload extends JwtPayload {
  id: number;
}

// Validates user inputs
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(registerSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation?.error?.format(),
    });
    return;
  }

  const { birthDate } = resultValidation.data;

  try {
    const userCreated = await UserModel.createUser({
      ...resultValidation.data,
      birthDate: new Date(birthDate),
    });

    await sendEmail('ValidateEmail', userCreated.email);

    res.status(HttpCode.CREATED).json({
      message: 'Usuario registrado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultValidation = zodValidation(loginSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const user = await UserModel.loginUser(resultValidation.data);

    const token = jwt.sign({ userId: user?.id }, String(JWT_SECRET), {
      expiresIn: '1h',
    });

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .send({
        user,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('access_token').json({ message: 'logout successfull' });
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(verifyEmailSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const { token } = resultValidation.data;

    const { id } = jwt.verify(token, String(JWT_SECRET)) as TokenPayload;

    if (isNaN(id)) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.BAD_REQUEST,
        description: 'El token no es válido.',
      });
    }

    await UserModel.verifyUserEmail(id);

    res.json({
      message: 'Correo verificado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(justUserEmailSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const { email } = resultValidation.data;

    const userFound = await UserModel.findUserByEmail(email);
    if (userFound instanceof AppError) return;

    if (userFound.emailVerified !== false) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.BAD_REQUEST,
        description: `El usuario con el correo ${email} ya está verificado.`,
      });
    }

    await sendEmail('ValidateEmail', email);

    res.status(HttpCode.OK).json({
      message: 'Correo de verificación enviado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const sendForgotPasswordEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(justUserEmailSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const { email } = resultValidation.data;
    const userFound = await UserModel.findUserByEmail(email);

    if (userFound === null) {
      throw new AppError({
        name: 'AuthError',
        httpCode: HttpCode.NOT_FOUND,
        description: `El usuario con el correo ${email} no está registrado.`,
      });
    }

    // TODO: Implement return token
    await sendEmail('ResetPassword', email);

    // TODO: Save reset token on database

    res.status(HttpCode.OK).json({
      message: 'Correo de recuperación enviado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(tokenAndNewPasswordSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  const { token, newPassword } = resultValidation.data;

  try {
    const { id } = jwt.verify(token, String(JWT_SECRET)) as TokenPayload;

    await UserModel.resetUserPassword(+id, newPassword);

    res.json({
      message: 'Contraseña actualizada correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

// Default
// export const default = async(req: Request, res: Response, next: NextFunction): Promise<void> => { }
