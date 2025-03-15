import { Role } from '@prisma/client';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: Date;
  email: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
  password: string;
  role?: Role;
}
