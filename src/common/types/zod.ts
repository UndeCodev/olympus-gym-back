import { ZodError, type ZodSchema, z } from 'zod';

export type ValidationSchemaResult<T extends ZodSchema> =
  | { success: true; data: z.infer<T> }
  | { success: false; error: ZodError };
