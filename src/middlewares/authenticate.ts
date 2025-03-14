import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env';
import { HttpCode } from '../common/enums/HttpCode';

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.access_token ?? null;

  if (!token) {
    res.status(HttpCode.FORBIDDEN).json({
      message: 'No token provided',
    });

    return;
  }

  try {
    const tokenDecoded = jwt.verify(token, String(JWT_SECRET));

    if (typeof tokenDecoded !== 'string' && 'id' in tokenDecoded) {
      res.locals.userId = (tokenDecoded as JwtPayload).id;
      return next();
    }

    res.status(HttpCode.FORBIDDEN).json({
      message: 'Invalid token',
    });
  } catch {
    res.status(HttpCode.FORBIDDEN).json({
      message: 'Invalid token',
    });
  }
};
