import { MessageType } from '@prisma/client';
import z from 'zod';

export const emailTemplateSchema = z.object({
  id: z.coerce
    .number({
      invalid_type_error: 'id must be a number',
      required_error: 'id is required',
    })
    .min(1, 'Min value expected 1'),
  messageType: z.optional(
    z.enum([MessageType.ValidateEmail, MessageType.ResetPassword], {
      message: `messageType solo debe de ser valor ${String(MessageType.ResetPassword)} o ${String(MessageType.ValidateEmail)}`,
    })
  ),
  subject: z.optional(
    z.string({
      invalid_type_error: 'subject must be a string',
    })
  ),
  title: z.optional(
    z.string({
      invalid_type_error: 'title must be a string',
    })
  ),
  message: z.optional(
    z.string({
      invalid_type_error: 'message must be a string',
    })
  ),
  actionPath: z.optional(
    z.string({
      invalid_type_error: 'actionPath must be a string',
    })
  ),
  actionButtonText: z.optional(
    z.string({
      invalid_type_error: 'actionButtonText must be a string',
    })
  ),
  subMessage: z.optional(
    z.string({
      invalid_type_error: 'subMessage must be a string',
    })
  ),
  expirationTime: z.optional(
    z.number({
      invalid_type_error: 'expirationTime must be a number',
    })
  ),
});

export const emailTemplateIdSchema = emailTemplateSchema.pick({ id: true });
