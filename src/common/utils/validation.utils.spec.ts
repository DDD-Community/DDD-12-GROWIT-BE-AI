import { ValidationUtils } from './validation.utils';

describe('ValidationUtils', () => {
  describe('isValidAdviceResponse', () => {
    it('should return true for valid advice response', () => {
      const validResponse =
        '오늘은 정말 좋은 하루였습니다. 많은 것을 배웠고 성장할 수 있었습니다.';
      expect(ValidationUtils.isValidAdviceResponse(validResponse)).toBe(true);
    });

    it('should return false for invalid responses', () => {
      expect(ValidationUtils.isValidAdviceResponse('')).toBe(false);
      expect(ValidationUtils.isValidAdviceResponse('짧음')).toBe(false);
      expect(ValidationUtils.isValidAdviceResponse('1234567890')).toBe(false);
    });
  });

  describe('isValidGoalResponse', () => {
    it('should return true for valid goal response', () => {
      const validGoal = '이번 주에 새로운 기술을 배우겠습니다';
      expect(ValidationUtils.isValidGoalResponse(validGoal)).toBe(true);
    });

    it('should return false for invalid responses', () => {
      expect(ValidationUtils.isValidGoalResponse('')).toBe(false);
      expect(ValidationUtils.isValidGoalResponse('짧음')).toBe(false);
    });
  });

  describe('validateAdviceInput', () => {
    it('should return valid for correct input', () => {
      const input = {
        overallGoal: '성공적인 개발자가 되기',
        recentTodos: ['코딩 공부', '프로젝트 진행'],
        weeklyRetrospects: ['잘한 점', '개선할 점'],
      };

      const result = ValidationUtils.validateAdviceInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing or invalid input', () => {
      const invalidInput = {
        overallGoal: '짧음',
        recentTodos: 'not an array' as any,
      };

      const result = ValidationUtils.validateAdviceInput(invalidInput);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateGoalRecommendationInput', () => {
    it('should return valid for correct input', () => {
      const input = {
        overallGoal: '성공적인 개발자가 되기',
        pastTodos: ['과거 할 일'],
        pastRetrospects: ['과거 회고'],
        completedTodos: ['완료된 할 일'],
        pastWeeklyGoals: ['과거 주간 목표'],
        remainingTime: '1주',
      };

      const result = ValidationUtils.validateGoalRecommendationInput(input);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing overallGoal', () => {
      const input = {
        pastTodos: ['과거 할 일'],
      };

      const result = ValidationUtils.validateGoalRecommendationInput(input);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('전체 목표는 필수입니다.');
    });
  });
});
