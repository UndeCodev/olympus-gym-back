import { Router } from 'express';

import * as SecuritySettingsController from '../controllers/security_settings.controller';

const securitySettingsRoutes = Router();

securitySettingsRoutes.get('/', SecuritySettingsController.getSecuritySettings);

export default securitySettingsRoutes;
