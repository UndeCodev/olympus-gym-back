import { PrismaClient, security_question } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SECURITY_QUESTIONS } from '../data/securityQuestions';
import { AppError } from '../../../exceptions/AppError';
import { HttpCode } from '../../../common/enums/HttpCode';
import { findUserByEmail } from '../../users/models/user.model';

const prisma = new PrismaClient();

interface SecretQuestionResponse {
  ok: boolean;
  question?: string;
}

export const findUserWithSecretQuestion = async (
  userId: number
): Promise<SecretQuestionResponse> => {
  const userHasSecurityQuestion = await prisma.security_question.findUnique({
    where: {
      userId,
    },
  });

  return {
    ok: userHasSecurityQuestion !== null,
    question: userHasSecurityQuestion?.question,
  };
};

export const findUserWithSecretQuestionByEmail = async (
  email: string
): Promise<SecretQuestionResponse> => {
  const userFound = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (userFound === null) {
    throw new AppError({
      name: 'SecurityError',
      httpCode: HttpCode.NOT_FOUND,
      description: `El usuario con el correo ${email} no fue encontrado.`,
    });
  }

  const userHasSecurityQuestion = await prisma.security_question.findUnique({
    where: {
      userId: userFound.id,
    },
  });

  return {
    ok: userHasSecurityQuestion !== null,
    question: userHasSecurityQuestion?.question,
  };
};

export const setSecurityQuestion = async (
  userId: number,
  question: string,
  answer: string
): Promise<security_question> => {
  if (!SECURITY_QUESTIONS.includes(question)) {
    throw new Error('La pregunta seleccionada no es válida.');
  }

  const hashedAnswer = await bcrypt.hash(answer, 10);
  return prisma.security_question.upsert({
    where: { userId },
    update: { question, answer: hashedAnswer },
    create: { userId, question, answer: hashedAnswer },
  });
};

export const removeSecurityQuestion = async (userId: number): Promise<void> => {
  await prisma.security_question.delete({
    where: {
      userId,
    },
  });
};

export const verifySecurityAnswer = async (
  email: string,
  question: string,
  answer: string
): Promise<boolean> => {
  const userFound = await findUserByEmail(email);

  const record = await prisma.security_question.findUnique({ where: { userId: userFound.id } });
  if (!record) return false;

  const isQuestionValid = record.question === question;
  const isAnswerValid = bcrypt.compare(answer, record.answer);

  return isQuestionValid && isAnswerValid;
};

export const getSecurityQuestions = (): string[] => {
  return SECURITY_QUESTIONS;
};
