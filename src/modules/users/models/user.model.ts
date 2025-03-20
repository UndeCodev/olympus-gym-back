import { PrismaClient, user } from '@prisma/client';

import type {
  AdminEditableUserData,
  AuthLoginDataUser,
  NonSensitiveUserData,
} from '../../auth/common/types/auth.types';
import { AppError } from '../../../exceptions/AppError';

import { hashPassword } from '../../../utils/hashPassword';
import { comparePassword } from '../../../utils/comparePassword';

import { User } from '../common/interfaces/user.interface';
import { HttpCode } from '../../../common/enums/HttpCode';
import { getSecuritySettings } from '../../configuration/models/security_settings.model';

const prisma = new PrismaClient();

// Allowed methods to Client
export const findUserByEmail = async (email: string): Promise<user> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user === null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `El usuario con el email ${email} no está registrado`,
    });
  }

  return user;
};

export const findUserById = async (id: number): Promise<user> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user === null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `Usuario no encontrado.`,
    });
  }

  return user;
};

export const findUserByIdWithoutSensitiveData = async (
  id: number
): Promise<NonSensitiveUserData> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      birthDate: true,
      role: true,
      twoFactorEnabled: true,
    },
  });

  if (user === null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `Usuario no encontrado.`,
    });
  }

  return user;
};

export const createUser = async (input: User): Promise<User> => {
  const { firstName, lastName, phoneNumber, birthDate, email, password } = input;

  const userFound = await prisma.user.findUnique({
    where: { email },
  });

  if (userFound !== null) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: `El usuario con el correo ${email} ya existe`,
    });
  }

  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      firstName,
      lastName,
      phoneNumber,
      birthDate,
      email,
      password: hashedPassword,
    },
  });
};

export const loginUser = async (input: AuthLoginDataUser): Promise<NonSensitiveUserData> => {
  const { email, password } = input;

  const userFound = await findUserByEmail(email);

  if (!userFound.emailVerified) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.UNAUTHORIZED,
      description:
        'Por favor, revisa tu buzón de correo y confirma tu correo electrónico para poder iniciar sesión.',
    });
  }

  const today = new Date();

  // Check if account is locked and if the lock period is still active
  if (userFound.accountLocked && userFound.timeToUnlock && userFound.timeToUnlock > today) {
    const lockMinutesLeft = Math.ceil((userFound.timeToUnlock.getTime() - today.getTime()) / 60000);

    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: `La cuenta estará bloqueada durante ${lockMinutesLeft} minutos por razones de seguridad.`,
    });
  }

  const verifyPassword = await comparePassword(password, userFound.password);

  if (!verifyPassword) {
    const { maxLoginAttempts, lockDurationMinutes } = await getSecuritySettings();

    const newFailedAttempts = ++userFound.failedLoginAttempts;

    const updateData: {
      failedLoginAttempts: number;
      accountLocked?: boolean;
      timeToUnlock?: Date | null;
    } = {
      failedLoginAttempts: newFailedAttempts,
    };

    // Lock the account if max attempts are reached
    if (newFailedAttempts >= maxLoginAttempts) {
      updateData.accountLocked = true;
      updateData.timeToUnlock = new Date(today.getTime() + lockDurationMinutes * 60000);
    }

    await prisma.user.update({
      where: { id: userFound.id },
      data: updateData,
    });

    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: `El correo electrónico o la contraseña son inválidos. Intentos fallidos: ${newFailedAttempts} de ${maxLoginAttempts}.`,
    });
  }

  if (userFound.failedLoginAttempts > 0 || userFound.accountLocked) {
    await prisma.user.update({
      where: { id: userFound.id },
      data: {
        failedLoginAttempts: 0,
        accountLocked: false,
        timeToUnlock: null,
      },
    });
  }

  const user: NonSensitiveUserData = {
    id: userFound.id,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    phoneNumber: userFound.phoneNumber,
    birthDate: userFound.birthDate,
    email: userFound.email,
    role: userFound.role,
    twoFactorEnabled: userFound.twoFactorEnabled,
  };

  return user;
};

export const verifyUserEmail = async (id: number): Promise<string> => {
  const userFound = await findUserById(id);

  if (userFound.emailVerified) {
    throw new AppError({
      name: 'AuthError',
      httpCode: HttpCode.BAD_REQUEST,
      description: 'El correo electrónico ya ha sido verificado',
    });
  }

  const userUpdated = await prisma.user.update({
    where: {
      id,
    },
    data: {
      emailVerified: true,
    },
    select: {
      email: true,
    },
  });

  return userUpdated.email;
};

export const resetUserPassword = async (userId: number, newPassword: string): Promise<void> => {
  await findUserById(userId);

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

// Allowed methods to Admin
export const getAllUsers = async (): Promise<user[]> => {
  const allUsers = await prisma.user.findMany();

  return allUsers;
};

export const updateUserDetails = async (
  userId: number,
  dataToUpdate: Partial<AdminEditableUserData>
): Promise<AdminEditableUserData> => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    role,
    accountLocked,
    failedLoginAttempts,
    timeToUnlock,
    emailVerified,
  } = dataToUpdate;

  const userDetailsUpdated = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      firstName,
      lastName,
      phoneNumber,
      email, // Reverification
      role, // Reverification
      accountLocked,
      failedLoginAttempts,
      timeToUnlock,
      emailVerified,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
      role: true,
      accountLocked: true,
      failedLoginAttempts: true,
      timeToUnlock: true,
      emailVerified: true,
    },
  });

  return userDetailsUpdated;
};

// export const default = async(input: data): Promise<user> => {
// }
