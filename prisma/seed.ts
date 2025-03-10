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

const main = async () => {
  for (const template of emailTemplates) {
    await prisma.email_template.upsert({
      where: { messageType: template.messageType as MessageType },
      update: {},
      create: template,
    });
  }
  console.log('Email templates inserted correctly');
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
