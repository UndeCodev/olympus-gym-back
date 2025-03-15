import { MessageType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const emailTemplates = [
  {
    messageType: MessageType.ResetPassword,
    subject: 'Restablece tu contraseña',
    title: 'Solicitud de restablecimiento de contraseña',
    message:
      'Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Olympus GYM. Si realizaste esta solicitud, haz clic en el botón de abajo para continuar con el proceso.',
    actionPath: '/restablecer-contrasena',
    actionButtonText: 'Restablecer Contraseña',
    subMessage:
      'Si no has solicitado esta acción, por favor ignora este correo. Este enlace expirará en 24 horas.',
    expirationTime: 86400,
  },
  {
    messageType: MessageType.ValidateEmail,
    subject: 'Confirma tu correo electrónico',
    title: 'Verificación de correo electrónico',
    message:
      'Gracias por registrarte en Olympus GYM. Para completar tu registro, por favor confirma tu correo electrónico haciendo clic en el botón de abajo.',
    actionPath: '/confirmar-correo',
    actionButtonText: 'Confirmar Correo Electrónico',
    subMessage: 'Si no realizaste esta acción, por favor ignora este correo.',
    expirationTime: 86400,
  },
];

const main = async (): Promise<void> => {
  for (const template of emailTemplates) {
    await prisma.email_template.upsert({
      where: { messageType: template.messageType as MessageType },
      update: {},
      create: template,
    });
  }

  console.log('Email templates inserted correctly');

  await prisma.company_profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      logo: 'https://res.cloudinary.com/dxhd2qugi/image/upload/c_thumb,w_200,g_face/v1740345372/olympus_gym/logos/kspuqawjzxaimtkic4xp.png',
      name: 'Olympus GYM',
      slogan: 'Entrena fuerte, vive mejor',
      address: 'Calle Ficticia #123, Ciudad, País',
      zip: '43060',
      phoneNumber: '+52 123 456 7890',
      email: 'olympusgym@soporte.com',
      schedule: [
        { days: 'Lunes a Viernes', open: '6:00 A.M.', close: '10:00 P.M.' },
        { days: 'Sábados', open: '10:00 A.M.', close: '2:00 P.M.' },
      ],
      socialMedia: {
        facebook: 'https://facebook.com/olympusgym',
      },
    },
  });

  console.log('Company profile inserted correctly');

  await prisma.security_settings_accounts.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maxLoginAttempts: 5,
      lockDurationMinutes: 15,
    },
  });

  console.log('Security settings to accounts inserted correctly');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
