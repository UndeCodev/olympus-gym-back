import { NonSensitiveUserData } from '../../auth/common/types/auth.types';
import * as UserModel from './user.model';

// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient();

export const getUserProfile = async (id: number): Promise<NonSensitiveUserData> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, failedLoginAttempts, timeToUnlock, accountLocked, ...userFound } =
    await UserModel.findUserById(id);

  return userFound;
};
