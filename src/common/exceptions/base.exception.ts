import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorContext {
  code?: string;
  details?: Record<string, any>;
  timestamp?: Date;
  path?: string;
}

export class BaseException extends HttpException {
  public readonly context?: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    status: HttpStatus,
    context?: ErrorContext,
    isOperational = true,
  ) {
    super(message, status);
    this.context = {
      ...context,
      timestamp: context?.timestamp || new Date(),
    };
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
