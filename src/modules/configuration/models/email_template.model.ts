import { email_template, PrismaClient } from '@prisma/client';

import { AppError } from '../../../exceptions/AppError';
import { HttpCode } from '../../../common/enums/HttpCode';

const prisma = new PrismaClient();

export const getAllEmailTemplates = async (): Promise<email_template[]> => {
  return await prisma.email_template.findMany();
};

export const getEmailTemplateById = async (id: number): Promise<email_template> => {
  const emailTemplateFound = await prisma.email_template.findUnique({
    where: {
      id,
    },
  });

  if (emailTemplateFound === null) {
    throw new AppError({
      name: 'EmailTemplateNotFound',
      httpCode: HttpCode.NOT_FOUND,
      description: 'No se encontró la plantilla de correo',
    });
  }

  return emailTemplateFound;
};

export const updateEmailTemplateById = async (
  emailTemplateData: Partial<email_template> & { id: number }
): Promise<email_template> => {
  const { id, ...emailTemplateUpdated } = emailTemplateData;

  await getEmailTemplateById(id);

  return await prisma.email_template.update({
    where: {
      id,
    },
    data: {
      ...emailTemplateUpdated,
      updatedAt: new Date(),
    },
  });
};
