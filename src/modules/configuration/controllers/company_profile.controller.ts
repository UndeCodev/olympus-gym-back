import { Request, Response, NextFunction } from 'express';

import * as CompanyProfileModel from '../models/company_profile.model';

export const getCompanyProfile = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const companyProfile = await CompanyProfileModel.getCompanyProfile();

    res.json({
      companyProfile,
    });
  } catch (error) {
    next(error);
  }
};
