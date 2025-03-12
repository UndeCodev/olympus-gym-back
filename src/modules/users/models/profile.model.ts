import { PrismaClient } from '@prisma/client';

import * as UserModel from './user.model';

import { NonSensitiveUserData } from '../../auth/common/types/auth.types';

const prisma = new PrismaClient();

export const getUserProfile = async (id: number): Promise<NonSensitiveUserData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, failedLoginAttempts, timeToUnlock, accountLocked, ...userFound } =
    await UserModel.findUserById(id);

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
      emailVerified: true,
      twoFactorEnabled: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userProfileUpdated;
};
