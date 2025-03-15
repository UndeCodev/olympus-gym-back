import { Request, Response, NextFunction } from 'express';

import * as CompanyProfileModel from '../models/company_profile.model';

import { zodValidation } from '../../../utils/zodValidation';
import { companyProfileSchema } from '../schemas/companyProfile.schema';
import { HttpCode } from '../../../common/enums/HttpCode';
import { uploadImageToCloudinary } from '../../../services/cloudinary';

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

export const updateCompanyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const tempFile = req.file;
  const resultValidation = zodValidation(companyProfileSchema, req.body);

  if (!resultValidation.success) {
    res.status(HttpCode.BAD_REQUEST).json({
      message: 'Validation error',
      errors: resultValidation.error.format(),
    });
    return;
  }

  try {
    const { logoUrl, ...companyProfileData } = resultValidation.data;

    let logoURL = logoUrl ?? '';

    if (tempFile !== undefined && logoURL === '') {
      const tempFilePath = tempFile.path;

      const { url } = await uploadImageToCloudinary(tempFilePath, 'logos');

      logoURL = url;
    }

    const companyProfileUpdated = await CompanyProfileModel.updateCompanyProfile({
      ...companyProfileData,
      logo: logoURL,
    });

    res.json({
      companyProfileUpdated,
    });
  } catch (error) {
    next(error);
  }
};
