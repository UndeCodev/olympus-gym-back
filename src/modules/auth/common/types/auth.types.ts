import { user } from '@prisma/client';

export type NonSensitiveUserData = Pick<
  user,
  'id' | 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'birthDate' | 'role'
>;

export type AuthLoginDataUser = Pick<user, 'email' | 'password'>;
