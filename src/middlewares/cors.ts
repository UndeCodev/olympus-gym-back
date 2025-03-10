import cors from 'cors';
import { RequestHandler } from 'express';

const ACCEPTED_ORIGINS = ['http://localhost:5173'];

export const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS,
} = {}): RequestHandler =>
  cors({
    origin: (origin, callback) => {
      if (origin !== null || acceptedOrigins.includes(String(origin))) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });
