import z from 'zod';
import { ValidationSchemaResult } from '../../../common/types/zod';
import { zodValidation } from '../../../utils/zodValidation';

export const faqsSchema = z.object({
    question: z
        .string({
            invalid_type_error: 'Question must be a string',
            required_error: 'Question is required',
        })
        .min(5, 'Question must be at least 1 characters long')
        .trim(),
    answer: z
        .string({
            invalid_type_error: 'Answer must be a string',
            required_error: 'Answer is required',
        })
        .min(1, 'Question must be at least 1 characters long')
        .trim(),
});

const validateRange = z.object({
    start: z
      .number({
        invalid_type_error: "Value start must be a number",
        required_error: "Value start is required",
      })
      .min(1, "Value start must be at least 1"), // Min 1

    end: z
      .number({
        invalid_type_error: "Value end must be a number",
        required_error: "Value end is required",
      })
      .min(1, "Value end must be at least 1"), // Min 1
  })
  .refine((data) => data.end >= data.start, {
    message: "Value end must be greater than or equal to start",
    path: ["end"],
  });

export const validateFaqSchema = (data: unknown): ValidationSchemaResult<typeof faqsSchema> => zodValidation(faqsSchema, data)

export const validateRangeInFaqs = (data: unknown): ValidationSchemaResult<typeof validateRange> => zodValidation(validateRange, data)

