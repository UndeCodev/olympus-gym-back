process.loadEnvFile();

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  JWT_SECRET,
  SECRET_2FA,
  NODE_ENV = 'development',
  BASE_URL,
  FRONT_BASE_URL,
  GMAIL_APP_USER,
  GMAIL_APP_PASSWORD,
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} = process.env;
