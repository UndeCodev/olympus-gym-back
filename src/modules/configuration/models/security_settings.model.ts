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

export const updateSecuritySettings = async (
  data: Pick<security_settings_accounts, 'maxLoginAttempts' | 'lockDurationMinutes'>
): Promise<security_settings_accounts> => {
  const { lockDurationMinutes, maxLoginAttempts } = data;

  const currentSecuritySetting = await getSecuritySettings();

  const updatedSecuritySettings = await prisma.security_settings_accounts.update({
    where: {
      id: currentSecuritySetting.id,
    },
    data: {
      lockDurationMinutes,
      maxLoginAttempts,
    },
  });

  return updatedSecuritySettings;
};
