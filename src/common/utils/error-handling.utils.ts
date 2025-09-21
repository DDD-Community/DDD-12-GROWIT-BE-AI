import { Logger } from '@nestjs/common';

export class ErrorHandlingUtils {
  static logAndReturnError(
    logger: Logger,
    operation: string,
    error: Error,
    entityName: string,
  ): { success: false; entity: null; error: string } {
    logger.error(`Failed to ${operation} ${entityName}: ${error.message}`);

    return {
      success: false,
      entity: null,
      error: `${operation} failed: ${error.message}`,
    };
  }

  static logSuccess(
    logger: Logger,
    operation: string,
    entityName: string,
    entityId?: string,
  ): void {
    const idInfo = entityId ? ` with ID: ${entityId}` : '';
    logger.log(`Successfully ${operation} ${entityName}${idInfo}`);
  }

  static logOperationStart(
    logger: Logger,
    operation: string,
    userId: string,
    additionalInfo?: string,
  ): void {
    const info = additionalInfo ? ` - ${additionalInfo}` : '';
    logger.log(`${operation} for user ${userId}${info}`);
  }
}
