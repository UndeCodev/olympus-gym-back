import { Request, Response, NextFunction } from 'express';

import * as SecuritySettingsModel from '../models/security_settings.model';

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
