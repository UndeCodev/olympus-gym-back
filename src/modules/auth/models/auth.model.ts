import { PrismaClient } from '@prisma/client';

import * as UserModel from '../../users/models/user.model';

const prisma = new PrismaClient();

export const enable2FA = async (email: string): Promise<void> => {
  const userFound = await UserModel.findUserByEmail(email);

  if (!userFound.twoFactorEnabled) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        twoFactorEnabled: true,
      },
    });
  }
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
