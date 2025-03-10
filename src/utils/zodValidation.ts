import { ZodSchema } from 'zod';
import { ValidationSchemaResult } from '../common/types/zod';

export const zodValidation = <T extends ZodSchema>(
  schema: T,
  data: unknown
): ValidationSchemaResult<T> => {
  return schema.safeParse(data);
};
