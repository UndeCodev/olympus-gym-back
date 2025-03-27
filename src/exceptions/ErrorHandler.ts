import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import { AppError } from './AppError';
import { HttpCode } from '../common/enums/HttpCode';
import fs from 'node:fs';
import path from 'node:path';

class ErrorHandler {
  private logFilePath = path.join(__dirname, './logs/error.log');

  private isTrustedError(error: Error): boolean {
    if (error instanceof AppError) return error.isOperational;
    if (error instanceof JsonWebTokenError) return true;
    if (error.message.includes('token')) return true;

    return false;
  }

  public handleError(error: Error | AppError, response?: Response): void {
    this.logErrorToFile(error);

    if (this.isTrustedError(error) && response !== undefined) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(response);
    }
  }

  private handleTrustedError(error: AppError | Error, response: Response): void {
    if (error instanceof AppError) {
      response.status(error.httpCode).json({ message: error.message });
    }

    if (error instanceof JsonWebTokenError || error.message.includes('token')) {
      response
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: 'El token proporcionado ha expirado o es inválido.' });
    }
  }

  private handleCriticalError(response?: Response): void {
    if (response !== undefined) {
      response.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }

    console.log('Application encountered a critical error. Exiting');
    process.exit(1);
  }

  private async logErrorToFile(error: Error): Promise<void> {
    try {
      const errorMessage = `[${new Date().toISOString()}] ${error.name}: ${error.message}\nStack: ${error.stack}\n\n`;

      fs.appendFileSync(this.logFilePath, errorMessage, 'utf-8');
    } catch (error) {
      console.log(error);
    }
  }
}
export const errorHandler = new ErrorHandler();
