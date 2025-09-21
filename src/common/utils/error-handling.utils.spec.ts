import { Logger } from '@nestjs/common';
import { ErrorHandlingUtils } from './error-handling.utils';

describe('ErrorHandlingUtils', () => {
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logAndReturnError', () => {
    it('should log error and return error result', () => {
      const operation = 'create';
      const error = new Error('Test error');
      const entityName = 'User';

      const result = ErrorHandlingUtils.logAndReturnError(
        mockLogger,
        operation,
        error,
        entityName,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to create User: Test error',
      );
      expect(result).toEqual({
        success: false,
        entity: null,
        error: 'create failed: Test error',
      });
    });
  });
});
