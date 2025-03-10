import { Request, Response, NextFunction } from 'express';

import * as EmailTemplateModel from '../models/email_template.model';
import { zodValidation } from '../../../utils/zodValidation';
import { emailTemplateIdSchema, emailTemplateSchema } from '../schemas/emailTemplate.schema';
import { HttpCode } from '../../../common/enums/HttpCode';

export const getAllEmailTemplates = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const emailTemplates = await EmailTemplateModel.getAllEmailTemplates();

    res.json({
      emailTemplates,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmailTemplateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(emailTemplateIdSchema, req.params);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    // Template id validated from zod validation
    const { id } = resultValidation.data;

    console.log({ id });

    const emailTemplate = await EmailTemplateModel.getEmailTemplateById(id);

    res.json({
      emailTemplate,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmailTemplateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(emailTemplateSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const emailTemplateUpdated = await EmailTemplateModel.updateEmailTemplateById(
      resultValidation.data
    );

    res.json({
      emailTemplateUpdated,
    });
  } catch (error) {
    next(error);
  }
};
