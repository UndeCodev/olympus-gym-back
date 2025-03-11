import { z } from 'zod';

export const updateSecuritySettingsSchema = z.object({
  maxLoginAttempts: z
    .number({
      invalid_type_error: 'maxLoginAttempts must be a number',
      required_error: 'maxLoginAttempts is required',
    })
    .int()
    .positive({ message: 'Must be a positive integer.' }),
  lockDurationMinutes: z
    .number({
      invalid_type_error: 'lockDurationMinutes must be a number',
      required_error: 'lockDurationMinutes is required',
    })
    .int()
    .positive({ message: 'Must be a positive integer.' }),
});
