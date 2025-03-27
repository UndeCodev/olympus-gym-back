import { PrismaClient, user } from '@prisma/client';

import * as UserModel from './user.model';

import { NonSensitiveUserData } from '../../auth/common/types/auth.types';
import { AppError } from '../../../exceptions/AppError';
import { HttpCode } from '../../../common/enums/HttpCode';

const prisma = new PrismaClient();

export const getUserProfile = async (id: number): Promise<NonSensitiveUserData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, failedLoginAttempts, timeToUnlock, accountLocked, ...userFound } =
    await UserModel.findUserById(id);

  return userFound;
};

export const getUserByIdWithPassword = async (
  userId: number
): Promise<Pick<user, 'id' | 'email' | 'password'>> => {
  const userFound = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (userFound === null) {
    throw new AppError({
      name: 'UserNotFound',
      httpCode: HttpCode.NOT_FOUND,
      description: 'Usuario no encontrado.',
    });
  }

  return userFound;
};

export const updateUserProfile = async (
  dataToUpdate: Partial<NonSensitiveUserData>,
  userId: number
): Promise<NonSensitiveUserData> => {
  const userProfileUpdated = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...dataToUpdate,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      birthDate: true,
      role: true,
      twoFactorEnabled: true,
    },
  });

  return userProfileUpdated;
};

export const deleteUserProfile = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
