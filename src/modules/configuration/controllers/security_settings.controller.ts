import { Request, Response, NextFunction } from 'express';

import * as SecuritySettingsModel from '../models/security_settings.model';
import { zodValidation } from '../../../utils/zodValidation';
import { updateSecuritySettingsSchema } from '../schemas/securitySettings.schema';
import { HttpCode } from '../../../common/enums/HttpCode';

export const getSecuritySettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const securitySettings = await SecuritySettingsModel.getSecuritySettings();

    res.json({
      securitySettings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSecuritySettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resultValidation = zodValidation(updateSecuritySettingsSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const securitySettingsUpdated = await SecuritySettingsModel.updateSecuritySettings(
      resultValidation.data
    );

    res.json({
      securitySettingsUpdated,
    });
  } catch (error) {
    next(error);
  }
};
