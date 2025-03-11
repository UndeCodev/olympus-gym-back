import { z } from 'zod';

// Schema for each schedule entry
const scheduleEntrySchema = z.object({
  days: z.string().min(1, 'Days are required'),
  open: z
    .string()
    .regex(
      /^\d{1,2}:\d{2}\s?(A\.M\.|P\.M\.)$/,
      'Invalid opening time format. Valid example: "7:00 A.M."'
    ),
  close: z
    .string()
    .regex(
      /^\d{1,2}:\d{2}\s?(A\.M\.|P\.M\.)$/,
      'Invalid closing time format. Valid example: "10:00 P.M."'
    ),
});

// Schema for social media links
const socialMediaSchema = z
  .object({
    facebook: z.string().url('Invalid URL for Facebook').optional(),
    twitter: z.string().url('Invalid URL for Twitter').optional(),
    instagram: z.string().url('Invalid URL for Instagram').optional(),
  })
  .strict();

// Main schema for company profile
export const companyProfileSchema = z.object({
  logoUrl: z.string().url('Invalid URL format for logo').optional(),
  name: z
    .string({
      invalid_type_error: 'Name must be a string',
      required_error: 'Name is required',
    })
    .min(3, 'Company name must have at least 3 characters'),
  slogan: z
    .string({
      invalid_type_error: 'Slogan must be a string',
      required_error: 'Slogan is required',
    })
    .min(5, 'Slogan must have at least 5 characters')
    .max(100, 'Slogan cannot exceed 100 characters'),
  address: z
    .string({
      invalid_type_error: 'Address must be a string',
      required_error: 'Address is required',
    })
    .min(10, 'Address must have at least 10 characters'),
  zip: z
    .string({
      invalid_type_error: 'ZIP code must be a string',
      required_error: 'ZIP code is required',
    })
    .regex(/^\d{5}$/, 'Invalid ZIP code. Must be 5 digits'),
  phoneNumber: z
    .string({
      invalid_type_error: 'Phone number must be a string',
      required_error: 'Phone number is required',
    })
    .regex(/^(\+52\s?)?(\d{2,3})?-?\d{3}-?\d{4}$/, 'Invalid Mexican phone number format'),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
      required_error: 'Email is required',
    })
    .email('Invalid email format'),

  // New handling for schedule field
  schedule: z
    .union([
      z.array(scheduleEntrySchema), // Accepts an array
      z.string().transform((val, ctx) => {
        try {
          const parsed = JSON.parse(val);
          if (!Array.isArray(parsed)) {
            ctx.addIssue({
              code: 'custom',
              message: 'Invalid format: expected an array',
            });
            return z.NEVER;
          }
          return parsed;
        } catch {
          ctx.addIssue({
            code: 'custom',
            message: 'Invalid JSON format',
          });
          return z.NEVER;
        }
      }),
    ])
    .superRefine((parsed, ctx) => {
      if (Array.isArray(parsed)) {
        const validation = z.array(scheduleEntrySchema).safeParse(parsed);
        if (!validation.success) {
          validation.error.issues.forEach((issue) => ctx.addIssue(issue));
        }
      }
    }),

  socialMedia: z.coerce
    .string()
    .transform((val) => JSON.parse(val) as Record<string, string>)
    .superRefine((parsed, ctx) => {
      const result = socialMediaSchema.safeParse(parsed);
      if (!result.success) {
        result.error.issues.forEach((issue) => ctx.addIssue(issue));
      }
    }),
});
