import { NextFunction, Request, Response } from 'express';
import * as SecurityQuestionModel from '../models/securityQuestion.model';
import { HttpCode } from '../../../common/enums/HttpCode';

export const findUserWithSecretQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    const { ok, question } = await SecurityQuestionModel.findUserWithSecretQuestion(Number(id));

    res.json({
      ok,
      question,
    });
  } catch (error) {
    next(error);
  }
};

export const findUserWithSecretQuestionByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    const { ok, question } = await SecurityQuestionModel.findUserWithSecretQuestionByEmail(email);

    res.json({
      ok,
      question,
    });
  } catch (error) {
    next(error);
  }
};

export const setQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, question, answer } = req.body;
    if (!userId || !question || !answer) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    const result = await SecurityQuestionModel.setSecurityQuestion(userId, question, answer);
    res.status(200).json({ message: 'Pregunta secreta configurada correctamente', data: result });
  } catch (error) {
    next(error);
  }
};

export const removeQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'El campo id es obligatorio' });
      return;
    }

    await SecurityQuestionModel.removeSecurityQuestion(Number(id));

    res.sendStatus(HttpCode.OK);
  } catch (error) {
    next(error);
  }
};

export const verifyAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, question, answer } = req.body;
    if (!email || !question || !answer) {
      res.status(400).json({ message: 'Todos los campos son requeridos' });
      return;
    }

    const isValid = await SecurityQuestionModel.verifySecurityAnswer(email, question, answer);
    if (!isValid) {
      res.status(HttpCode.UNAUTHORIZED).json({ message: 'Respuesta incorrecta.' });
      return;
    }

    res.status(200).json({ message: 'Verificación exitosa' });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const questions = SecurityQuestionModel.getSecurityQuestions();
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
};
