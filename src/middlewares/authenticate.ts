import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

import { AppError } from '../exceptions/AppError';
import { HttpCode } from '../common/enums/HttpCode';

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.access_token ?? null;

  if (!token) {
    throw new AppError({
      name: 'TokenError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'No token provided',
    });
  }

  try {
    const tokenDecoded = jwt.verify(token, String(JWT_SECRET));

    if (typeof tokenDecoded !== 'string' && 'id' in tokenDecoded) {
      res.locals.userId = (tokenDecoded as JwtPayload).id;
      next();

      return;
    }

    throw new AppError({
      name: 'TokenError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'Invalid token',
    });
  } catch {
    throw new AppError({
      name: 'TokenError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'Invalid token',
    });
  }
};
