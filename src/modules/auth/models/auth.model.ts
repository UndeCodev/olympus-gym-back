import { PrismaClient } from '@prisma/client';

import * as UserModel from '../../users/models/user.model';
import bcrypt from 'bcrypt';
import { AppError } from '../../../exceptions/AppError';
import { HttpCode } from '../../../common/enums/HttpCode';
import { hashPassword } from '../../../utils/hashPassword';

const prisma = new PrismaClient();

export const enable2FA = async (email: string, secret: string): Promise<void> => {
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      twoFactorEnabled: true,
      twoFASecret: secret,
    },
  });
};

export const disable2FA = async (email: string): Promise<void> => {
  const userFound = await UserModel.findUserByEmail(email);

  if (userFound.twoFactorEnabled) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        twoFactorEnabled: false,
      },
    });
  }
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const userFound = await UserModel.findUserById(userId);

  const isPasswordValid = await bcrypt.compare(currentPassword, userFound.password);

  if (!isPasswordValid) {
    throw new AppError({
      name: 'CurrentPasswordIncorrect',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'Las credenciales no coinciden.',
    });
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};
