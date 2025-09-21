import { UserId } from './user-id.vo';

describe('UserId', () => {
  describe('create', () => {
    it('should create UserId with valid value', () => {
      const userId = UserId.create('user-123');
      expect(userId.getValue()).toBe('user-123');
    });

    it('should throw error for invalid values', () => {
      expect(() => UserId.create('')).toThrow('User ID cannot be empty');
      expect(() => UserId.create('   ')).toThrow('User ID cannot be empty');
      expect(() => UserId.create(null as any)).toThrow(
        'User ID cannot be empty',
      );
    });
  });

  describe('equals', () => {
    it('should return true for same values', () => {
      const userId1 = UserId.create('user-123');
      const userId2 = UserId.create('user-123');
      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for different values', () => {
      const userId1 = UserId.create('user-123');
      const userId2 = UserId.create('user-456');
      expect(userId1.equals(userId2)).toBe(false);
    });
  });
});
