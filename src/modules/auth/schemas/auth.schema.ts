import z from 'zod';
import validator from 'validator';
import { RegexPatterns } from '../../../common/regex/patterns';

export const registerSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: 'First name must be a string',
      required_error: 'First name is required',
    })
    .regex(RegexPatterns.onlyLetters, 'First name must contain only letters')
    .min(2, 'First name must be at least 2 characters long')
    .trim(),
  lastName: z
    .string({
      invalid_type_error: 'Last name must be a string',
      required_error: 'Last name is required',
    })
    .regex(RegexPatterns.onlyLetters, 'Last name must contain only letters')
    .min(2, 'Last name must be at least 2 characters long')
    .trim(),
  phoneNumber: z
    .string({
      invalid_type_error: 'Phone number must be a string',
      required_error: 'Phone number is required',
    })
    .regex(/^\d{3}-\d{3}-\d{4}$/, 'Invalid phone number format. Expected format: ###-###-####'),
  birthDate: z
    .string()
    .date()
    .transform((val) => new Date(val)),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email({
      message: 'Invalid email address',
    }),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .refine(
      validator.isStrongPassword,
      'Password must be contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol'
    ),
});

// Just the email and password without .refine
export const loginSchema = registerSchema.pick({ email: true }).extend({
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required',
  }),
});

export const tokenAndNewPasswordSchema = z.object({
  newPassword: z
    .string({
      invalid_type_error: 'Password must be a string',
      required_error: 'Password is required',
    })
    .refine(
      validator.isStrongPassword,
      'Password must be contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol'
    ),
  token: z.string({
    invalid_type_error: 'Token must be a string',
    required_error: 'Token is required',
  }),
});

// Just the email
export const justUserEmailSchema = registerSchema.pick({ email: true });

// Just the token
export const verifyEmailSchema = tokenAndNewPasswordSchema.pick({ token: true });
