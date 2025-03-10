import { Router } from 'express';

import emailTemplateRoutes from './email_template.routes';
import companyProfileRoutes from './company_profile.routes';

const configRoutes = Router();

configRoutes.use('/emails', emailTemplateRoutes);
configRoutes.use('/company-profile', companyProfileRoutes);

export default configRoutes;
