import { z } from 'zod';
import { loginSchema, registerSchema } from '../../auth/schemas/auth.schema';

// No sensitive user data accepted
export const userProfileSchema = registerSchema.omit({ password: true }).partial();
export const currentPasswordSchema = loginSchema.pick({ password: true });

export const userIdSchema = z.object({
  id: z.coerce.number({
    invalid_type_error: 'id must be a number',
    required_error: 'id is required',
  }),
});

export const updateUserSchema = userProfileSchema
  .omit({ birthDate: true })
  .extend({
    role: z.enum(['Client', 'Admin', 'Employee']),
    accountLocked: z.boolean(),
    failedLoginAttempts: z.number().int().nonnegative({
      message: 'failedLoginAttempts must be a positive integer number',
    }),
    timeToUnlock: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .nullable(),
    emailVerified: z.boolean(),
  })
  .partial();
