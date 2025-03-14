import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
<<<<<<< HEAD
import { JWT_SECRET } from '../config/env';

import { AppError } from '../exceptions/AppError';
=======

import { JWT_SECRET } from '../config/env';
>>>>>>> 63abb84c881610ca0fb12c7f6aac7c098d8c9607
import { HttpCode } from '../common/enums/HttpCode';

export const authenticateMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.access_token ?? null;

  if (!token) {
<<<<<<< HEAD
    throw new AppError({
      name: 'TokenError',
      httpCode: HttpCode.UNAUTHORIZED,
      description: 'No token provided',
    });
=======
    res.status(HttpCode.FORBIDDEN).json({
      message: 'No token provided',
    });

    return;
>>>>>>> 63abb84c881610ca0fb12c7f6aac7c098d8c9607
  }

  try {
    const tokenDecoded = jwt.verify(token, String(JWT_SECRET));

    if (typeof tokenDecoded !== 'string' && 'id' in tokenDecoded) {
<<<<<<< HEAD
      res.locals.user = (tokenDecoded as JwtPayload).id;
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
=======
      res.locals.userId = (tokenDecoded as JwtPayload).id;
      return next();
    }

    res.status(HttpCode.FORBIDDEN).json({
      message: 'Invalid token',
    });
  } catch {
    res.status(HttpCode.FORBIDDEN).json({
      message: 'Invalid token',
>>>>>>> 63abb84c881610ca0fb12c7f6aac7c098d8c9607
    });
  }
};
