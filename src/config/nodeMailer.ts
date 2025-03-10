import nodemailer from 'nodemailer';

import { GMAIL_APP_PASSWORD, GMAIL_APP_USER } from './env';

const config = {
  service: 'gmail',
  auth: {
    user: GMAIL_APP_USER,
    pass: GMAIL_APP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

export default transporter;
