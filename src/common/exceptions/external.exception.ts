import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorContext } from './base.exception';

export class ExternalServiceException extends BaseException {
  constructor(
    serviceName: string,
    message: string,
    context?: ErrorContext,
    isOperational = true,
  ) {
    super(
      `External service error (${serviceName}): ${message}`,
      HttpStatus.BAD_GATEWAY,
      context,
      isOperational,
    );
  }
}

export class OpenAIException extends ExternalServiceException {
  constructor(message: string, context?: ErrorContext) {
    super('OpenAI', message, context);
  }
}

export class DatabaseException extends BaseException {
  constructor(message: string, context?: ErrorContext) {
    super(
      `Database error: ${message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      context,
      false, // Database errors are typically not operational
    );
  }
}
