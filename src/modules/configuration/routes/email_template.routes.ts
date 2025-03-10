import { Router } from 'express';
import * as EmailTemplateController from '../controllers/email_template.controller';

const emailTemplateRoutes = Router();

emailTemplateRoutes.get('/', EmailTemplateController.getAllEmailTemplates);
emailTemplateRoutes.get('/:id', EmailTemplateController.getEmailTemplateById);

emailTemplateRoutes.put('/', EmailTemplateController.updateEmailTemplateById);

export default emailTemplateRoutes;
