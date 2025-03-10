import { Request, Response, NextFunction } from 'express';

import { errorHandler } from '../exceptions/ErrorHandler';
import { AppError } from '../exceptions/AppError';

export const errorHandlerMiddleware = (
  err: Error | AppError,
  _req: Request,
  response: Response,
  next: NextFunction
): void => {
  errorHandler.handleError(err, response);
  next();
};
