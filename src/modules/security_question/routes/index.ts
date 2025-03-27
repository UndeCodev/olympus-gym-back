import { Router } from 'express';
import * as SecurityQuestionController from '../controllers/securityQuestion.controller';

const securityQuestionRouter = Router();

securityQuestionRouter.get('/', SecurityQuestionController.getQuestions);
securityQuestionRouter.get('/:id', SecurityQuestionController.findUserWithSecretQuestion);

securityQuestionRouter.post('/', SecurityQuestionController.findUserWithSecretQuestionByEmail);

securityQuestionRouter.delete('/:id', SecurityQuestionController.removeQuestion);
securityQuestionRouter.post('/set-security-question', SecurityQuestionController.setQuestion);
securityQuestionRouter.post('/verify-security-answer', SecurityQuestionController.verifyAnswer);

export default securityQuestionRouter;
