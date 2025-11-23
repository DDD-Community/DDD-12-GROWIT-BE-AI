import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../exceptions';

interface ErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error?: string;
  code?: string;
  details?: Record<string, any>;
  stack?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Log based on severity
    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(
        `${request.method} ${request.url} - ${errorResponse.message}`,
      );
    }

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    // Handle BaseException (our custom exceptions)
    if (exception instanceof BaseException) {
      return {
        success: false,
        statusCode: exception.getStatus(),
        timestamp,
        path,
        method,
        message: exception.message,
        error: exception.name,
        code: exception.context?.code,
        details: exception.context?.details,
        ...(process.env.NODE_ENV === 'development' && {
          stack: exception.stack,
        }),
      };
    }

    // Handle standard HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return {
        success: false,
        statusCode: status,
        timestamp,
        path,
        method,
        message:
          typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || exception.message,
        error: exception.name,
        ...(typeof exceptionResponse === 'object' &&
          'error' in exceptionResponse && {
            details: exceptionResponse as Record<string, any>,
          }),
        ...(process.env.NODE_ENV === 'development' && {
          stack: exception.stack,
        }),
      };
    }

    // Handle unknown errors
    const error =
      exception instanceof Error ? exception : new Error('Unknown error');

    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path,
      method,
      message: 'Internal server error',
      error: error.name,
      ...(process.env.NODE_ENV === 'development' && {
        details: { originalMessage: error.message },
        stack: error.stack,
      }),
    };
  }
}
