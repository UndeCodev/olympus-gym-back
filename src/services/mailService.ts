import { MessageType, PrismaClient } from '@prisma/client';
import { AppError } from '../exceptions/AppError';
import { HttpCode } from '../common/enums/HttpCode';
import mailTransporter from '../config/nodeMailer';
import Mail from 'nodemailer/lib/mailer';
import { GMAIL_APP_USER, JWT_SECRET, FRONT_BASE_URL } from '../config/env';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const sendEmail = async (
  emailType: MessageType,
  to: string
): Promise<boolean | AppError> => {
  const emailTypeFound = await prisma.email_template.findUnique({
    where: {
      messageType: emailType,
    },
  });

  if (emailTypeFound === null) {
    throw new AppError({
      name: 'EmailError',
      httpCode: HttpCode.NOT_FOUND,
      description: `El tipo de correo ${emailType} no existe`,
    });
  }

  const userFound = await prisma.user.findUnique({
    where: {
      email: to,
    },
    select: {
      id: true,
      firstName: true,
    },
  });

  if (userFound === null) {
    throw new AppError({
      name: 'UserError',
      httpCode: HttpCode.NOT_FOUND,
      description: `El usuario con el correo ${to} no está registrado.`,
    });
  }

  try {
    const token = jwt.sign({ id: userFound.id }, String(JWT_SECRET), {
      expiresIn: emailTypeFound.expirationTime,
    });

    const url = `${String(FRONT_BASE_URL)}/${String(emailTypeFound.actionPath)}/${token}`;

    const mailOptions: Mail.Options = {
      from: `Olympus GYM - ${String(GMAIL_APP_USER)}`,
      to,
      subject: emailTypeFound.subject,
      html: `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <tr>
            <td>
                <div style="padding: 40px 50px; text-align: center;">
                    <!-- Logo o Encabezado -->
                    <div style="margin-bottom: 30px; padding: 20px; background-color: #1F2223; border-radius: 6px;">
                        <h1 style="color: #ffffff; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
                            Olympus GYM
                        </h1>
                    </div>

                    <!-- Contenedor Principal -->
                    <div style="text-align: left;">
                        <h1 style="color: #1F2223; font-size: 28px; margin: 0 0 25px 0; font-weight: 600;">
                            ${String(emailTypeFound.title)}
                        </h1>
                        
                        <p style="color: #363939; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                          ${String(emailTypeFound.message)}
                        </p>

                        <!-- Botón de Acción -->
                        <div style="text-align: center; margin: 35px 0;">
                            <a href="${url}"
                               target="_blank"
                               style="display: inline-block;
                                      background-color: #D9323B;
                                      color: #ffffff;
                                      text-decoration: none;
                                      padding: 15px 35px;
                                      border-radius: 6px;
                                      font-weight: 600;
                                      font-size: 16px;
                                      text-transform: uppercase;
                                      letter-spacing: 0.5px;
                                      transition: background-color 0.3s ease;">
                                ${String(emailTypeFound.actionButtonText)}
                            </a>
                        </div>

                        <p style="color: #57595A; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
                            ${String(emailTypeFound.subMessage)}
                        </p>

                        <!-- Firma -->
                        <p style="color: #363939; font-size: 16px; line-height: 1.6; margin: 30px 0;">
                            Gracias,<br />
                            <strong>El equipo de Olympus GYM</strong>
                        </p>

                        <!-- Línea Divisoria -->
                        <div style="border-top: 1px solid #E5E5E5; margin: 30px 0;"></div>

                        <!-- Footer -->
                        <div style="text-align: center;">
                            <p style="color: #8E9090; font-size: 13px; margin: 0;">
                                © 2024 Olympus GYM. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>`,
    };

    await mailTransporter.sendMail(mailOptions);

    return true;
  } catch {
    throw new AppError({
      name: 'EmailError',
      httpCode: HttpCode.INTERNAL_SERVER_ERROR,
      description: 'Hubo un problema al enviar el correo...',
    });
  }
};
