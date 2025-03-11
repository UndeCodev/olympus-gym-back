import { Router } from 'express';

import emailTemplateRoutes from './email_template.routes';
import companyProfileRoutes from './company_profile.routes';
import securitySettingsRoutes from './security_settings.routes';

const configRoutes = Router();

configRoutes.use('/emails', emailTemplateRoutes);
configRoutes.use('/company-profile', companyProfileRoutes);
configRoutes.use('/security-settings-accounts', securitySettingsRoutes);

export default configRoutes;
