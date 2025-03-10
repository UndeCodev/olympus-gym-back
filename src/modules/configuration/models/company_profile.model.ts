import { company_profile, PrismaClient } from '@prisma/client';
import { AppError } from '../../../exceptions/AppError';
import { HttpCode } from '../../../common/enums/HttpCode';

const prisma = new PrismaClient();

export const getCompanyProfile = async (): Promise<company_profile> => {
  const companyProfile = await prisma.company_profile.findFirst();

  if (companyProfile === null) {
    throw new AppError({
      name: 'CompanyProfileError',
      httpCode: HttpCode.NOT_FOUND,
      description: 'No hay ningún perfil de la empresa',
    });
  }

  return companyProfile;
};
