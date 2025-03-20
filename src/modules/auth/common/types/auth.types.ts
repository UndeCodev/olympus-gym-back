import { user } from '@prisma/client';

export type NonSensitiveUserData = Pick<
  user,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phoneNumber'
  | 'birthDate'
  | 'role'
  | 'twoFactorEnabled'
>;

export type AuthLoginDataUser = Pick<user, 'email' | 'password'>;

export type AdminEditableUserData = Pick<
  user,
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'email'
  | 'role'
  | 'accountLocked'
  | 'failedLoginAttempts'
  | 'timeToUnlock'
  | 'emailVerified'
>;
