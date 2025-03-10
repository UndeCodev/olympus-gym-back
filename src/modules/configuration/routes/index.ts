import { Router } from 'express';
import * as EmailTemplateController from '../controllers/email_template.controller';

const configRoutes = Router();

configRoutes.get('/emails', EmailTemplateController.getAllEmailTemplates);
configRoutes.get('/emails/:id', EmailTemplateController.getEmailTemplateById);
configRoutes.put('/emails', EmailTemplateController.updateEmailTemplateById);

export default configRoutes;
