import { HttpStatus } from '@nestjs/common';
import { BaseException, ErrorContext } from './base.exception';

export class BusinessException extends BaseException {
  constructor(message: string, context?: ErrorContext) {
    super(message, HttpStatus.BAD_REQUEST, context);
  }
}

export class NotFoundException extends BaseException {
  constructor(resource: string, identifier?: string, context?: ErrorContext) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, HttpStatus.NOT_FOUND, context);
  }
}

export class AlreadyExistsException extends BaseException {
  constructor(resource: string, identifier?: string, context?: ErrorContext) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' already exists`
      : `${resource} already exists`;
    super(message, HttpStatus.CONFLICT, context);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string, context?: ErrorContext) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, context);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized access', context?: ErrorContext) {
    super(message, HttpStatus.UNAUTHORIZED, context);
  }
}

export class ForbiddenException extends BaseException {
  constructor(
    message = 'Access to this resource is forbidden',
    context?: ErrorContext,
  ) {
    super(message, HttpStatus.FORBIDDEN, context);
  }
}
