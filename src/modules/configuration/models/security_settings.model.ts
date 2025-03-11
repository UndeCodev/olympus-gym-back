import { PrismaClient, security_settings_accounts } from '@prisma/client';
import { AppError } from '../../../exceptions/AppError';
import { HttpCode } from '../../../common/enums/HttpCode';

const prisma = new PrismaClient();

export const getSecuritySettings = async (): Promise<security_settings_accounts> => {
  const securitySettings = await prisma.security_settings_accounts.findFirst();

  if (securitySettings === null) {
    throw new AppError({
      name: 'SecuritySettingsNotFound',
      httpCode: HttpCode.NOT_FOUND,
      description: 'Configuración de seguridad no encontrada',
    });
  }

  return securitySettings;
};
