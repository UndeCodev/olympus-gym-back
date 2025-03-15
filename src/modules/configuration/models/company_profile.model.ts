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

export const updateCompanyProfile = async (
  inputData: Omit<company_profile, 'id'>
): Promise<company_profile> => {
  const { socialMedia, schedule, ...dataToUpdate } = inputData;

  const companyProfile = await getCompanyProfile();

  const companyProfileUpdated = await prisma.company_profile.update({
    where: {
      id: companyProfile.id,
    },
    data: {
      socialMedia: socialMedia ?? undefined,
      schedule: schedule ?? undefined,
      ...dataToUpdate,
    },
  });

  return companyProfileUpdated;
};
