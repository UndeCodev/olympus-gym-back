import { JsonWebTokenError } from 'jsonwebtoken';
import { Response } from 'express';

import { AppError } from './AppError';
import { HttpCode } from '../common/enums/HttpCode';

class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) return error.isOperational;
    if (error instanceof JsonWebTokenError) return true;

    return false;
  }

  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response !== undefined) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(response);
    }
  }

  private handleTrustedError(
    error: AppError | Error,
    response: Response
  ): void {
    if (error instanceof AppError) {
      response.status(error.httpCode).json({ message: error.message });
    }
    if (error instanceof JsonWebTokenError) {
      response
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: 'El token proporcionado ha expirado o es inválido.' });
    }
  }

  private handleCriticalError(response?: Response): void {
    // TODO: Implement an error log file

    if (response !== undefined) {
      response
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }

    console.log('Application encountered a critical error. Exiting');
    process.exit(1);
  }
}
export const errorHandler = new ErrorHandler();
