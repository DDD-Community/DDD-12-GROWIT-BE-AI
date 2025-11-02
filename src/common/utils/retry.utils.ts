import { Logger } from '@nestjs/common';

export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  exponentialBackoff?: boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

export class RetryUtils {
  private static readonly logger = new Logger(RetryUtils.name);

  /**
   * Retry a function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions,
  ): Promise<T> {
    const {
      maxAttempts,
      delayMs,
      exponentialBackoff = true,
      onRetry,
    } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxAttempts) {
          this.logger.error(
            `Failed after ${maxAttempts} attempts: ${lastError.message}`,
          );
          throw lastError;
        }

        const delay = exponentialBackoff
          ? delayMs * Math.pow(2, attempt - 1)
          : delayMs;

        this.logger.warn(
          `Attempt ${attempt}/${maxAttempts} failed: ${lastError.message}. Retrying in ${delay}ms...`,
        );

        if (onRetry) {
          onRetry(lastError, attempt);
        }

        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
