import { User } from '../../../users/common/interfaces/user.interface';

export type NonSensitiveUserData = Omit<User, 'password' | 'emailVerified' | 'twoFactorEnabled'>;

export type AuthLoginDataUser = Pick<User, 'email' | 'password'>;
