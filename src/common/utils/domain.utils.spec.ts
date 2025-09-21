import { DomainUtils } from './domain.utils';

describe('DomainUtils', () => {
  describe('createErrorResult', () => {
    it('should create error result with correct structure', () => {
      const errorMessage = 'Test error message';
      const result = DomainUtils.createErrorResult(errorMessage);

      expect(result).toEqual({
        success: false,
        entity: null,
        error: errorMessage,
      });
    });
  });

  describe('createSuccessResult', () => {
    it('should create success result with entity', () => {
      const mockEntity = { id: 1, name: 'test' };
      const result = DomainUtils.createSuccessResult(mockEntity);

      expect(result).toEqual({
        success: true,
        entity: mockEntity,
      });
    });
  });
});
