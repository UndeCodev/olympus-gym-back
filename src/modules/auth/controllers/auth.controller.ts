import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import qrcode from 'qrcode';

import * as UserModel from '../../users/models/user.model';
import * as AuthModel from '../../auth/models/auth.model';

import { changePasswordSchema } from '../../auth/schemas/auth.schema';
import { JWT_SECRET, NODE_ENV } from '../../../config/env';
import { HttpCode } from '../../../common/enums/HttpCode';
import {
  registerSchema,
  loginSchema,
  justUserEmailSchema,
  tokenAndNewPasswordSchema,
  verifyEmailSchema,
  verify2FaSchema,
} from '../schemas/auth.schema';

import { AppError } from '../../../exceptions/AppError';
import { sendEmail } from '../../../services/mailService';
import { zodValidation } from '../../../utils/zodValidation';
import { authenticator } from 'otplib';
import { PrismaClient } from '@prisma/client';

interface TokenPayload extends JwtPayload {
  id: number;
}

const prisma = new PrismaClient();

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

  try {
    const userCreated = await UserModel.createUser({ ...resultValidation.data });

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

    if (user.twoFactorEnabled) {
      res.json({
        requires2FA: true,
        userId: user.id,
      });

      return;
    }

    const token = jwt.sign({ id: user.id }, String(JWT_SECRET), {
      expiresIn: '1h',
    });

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .json({
        requires2FA: false,
        userId: user.id,
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('access_token').sendStatus(HttpCode.OK);
  } catch (error) {
    next(error);
  }
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

    const tokenDecoded = jwt.verify(token, String(JWT_SECRET)) as TokenPayload;

    if (typeof tokenDecoded !== 'string' && 'id' in tokenDecoded) {
      const { id } = tokenDecoded;

      const email = await UserModel.verifyUserEmail(id);

      res.json({
        email,
      });

      return;
    }
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
      email,
    });
  } catch (error) {
    next(error);
  }
};

export const sendResetPasswordEmail = async (
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

    // Verify that the user exits on the database
    await UserModel.findUserByEmail(email);

    await sendEmail('ResetPassword', email);

    res.status(HttpCode.OK).json({
      message: 'Correo de recuperación enviado correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const setNewPassword = async (
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

    await UserModel.resetUserPassword(id, newPassword);

    res.json({
      message: 'Contraseña actualizada correctamente.',
    });
  } catch (error) {
    next(error);
  }
};

export const checkSecurityQuestion = async (
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

  const { email } = resultValidation.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { securityQuestion: true },
    });

    if (!user) {
      res.status(HttpCode.NOT_FOUND).json({
        message: 'no se encontro al usuario',
      });
      return;
    }

    if (!user.securityQuestion) {
      res.json({
        hasSecurityQuestion: false,
      });
      return;
    }

    res.json({
      hasSecurityQuestion: true,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(changePasswordSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const userId = res.locals.userId;

    const { currentPassword, newPassword } = resultValidation.data;

    await AuthModel.changePassword(userId, currentPassword, newPassword);

    res.sendStatus(HttpCode.OK);
  } catch (error) {
    next(error);
  }
};

export const setup2FA = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = res.locals.userId;

  try {
    const userFound = await UserModel.findUserById(+userId);

    const secret = authenticator.generateSecret();
    const keyUri = authenticator.keyuri(userFound.email, 'OlympusGYM', secret);
    const qrCodeSetup = await qrcode.toDataURL(keyUri);

    res.json({
      qrCodeSetup,
      manualCode: secret,
    });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const resultValidation = zodValidation(verify2FaSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });

    console.log(resultValidation.error.format());
    return;
  }

  try {
    const { token, userId, secret } = resultValidation.data;

    const userFound = await UserModel.findUserById(+userId);

    if (!userFound.twoFactorEnabled && secret) {
      await AuthModel.enable2FA(userFound.email, secret);
    }

    const isTokenValid = authenticator.verify({
      token,
      secret: secret ?? String(userFound.twoFASecret),
    });

    if (!isTokenValid) {
      res.status(HttpCode.UNAUTHORIZED).json({
        message: 'Código de verificación inválido.',
      });

      return;
    }

    const jwtToken = jwt.sign({ id: userFound.id }, String(JWT_SECRET), {
      expiresIn: '1h',
    });

    res
      .cookie('access_token', jwtToken, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const disable2FA = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = res.locals.userId;

  try {
    const userFound = await UserModel.findUserById(+userId);

    if (!userFound.twoFactorEnabled) {
      res.json({
        message: 'La autenticación de 2 pasos ya está desactivada.',
      });

      return;
    }

    await AuthModel.disable2FA(userFound.email);

    res.sendStatus(HttpCode.OK);
  } catch (error) {
    next(error);
  }
};

export const checkAuthStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.userId;

    const user = await UserModel.findUserByIdWithoutSensitiveData(userId);

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Default
// export const default = async(req: Request, res: Response, next: NextFunction): Promise<void> => { }
