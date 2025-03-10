import { Router } from 'express';
import * as CompanyProfileController from '../controllers/company_profile.controller';

const companyProfileRoutes = Router();

companyProfileRoutes.get('/', CompanyProfileController.getCompanyProfile);

export default companyProfileRoutes;
