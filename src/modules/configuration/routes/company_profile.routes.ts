import { Router } from 'express';

import { upload } from '../../../config/multer';

import * as CompanyProfileController from '../controllers/company_profile.controller';

const companyProfileRoutes = Router();

companyProfileRoutes.get('/', CompanyProfileController.getCompanyProfile);
companyProfileRoutes.put(
  '/',
  upload.single('logoFile'),
  CompanyProfileController.updateCompanyProfile
);

export default companyProfileRoutes;
