import { MentorTypeVO } from '../../ai/domain/value-objects/mentor-type.vo';
import { AdviceAggregate } from './advice.domain';
import { UserId } from './value-objects/user-id.vo';

describe('AdviceAggregate', () => {
  const mockUserId = 'user-123';
  const mockPromptId = 'prompt-456';
  const mockMentorType = '피터 레벨스';
  const mockRecentTodos = ['코딩 공부', '프로젝트 진행'];
  const mockWeeklyRetrospects = ['잘한 점', '개선할 점'];
  const mockOverallGoal = '성공적인 개발자가 되기';

  describe('create', () => {
    it('should create AdviceAggregate with valid data', () => {
      const advice = AdviceAggregate.create(
        mockUserId,
        mockPromptId,
        mockMentorType,
        mockRecentTodos,
        mockWeeklyRetrospects,
        mockOverallGoal,
      );

      expect(advice.userId).toBeInstanceOf(UserId);
      expect(advice.userId.getValue()).toBe(mockUserId);
      expect(advice.input.mentorType).toBeInstanceOf(MentorTypeVO);
      expect(advice.input.mentorType.getValue()).toBe(mockMentorType);
      expect(advice.input.recentTodos).toEqual(mockRecentTodos);
      expect(advice.input.weeklyRetrospects).toEqual(mockWeeklyRetrospects);
      expect(advice.input.overallGoal).toBe(mockOverallGoal);
      expect(advice.output).toBe('');
      expect(advice.uid).toBeDefined();
    });
  });

  describe('canGenerateAdvice', () => {
    it('should return true when input data is sufficient', () => {
      const advice = AdviceAggregate.create(
        mockUserId,
        mockPromptId,
        mockMentorType,
        mockRecentTodos,
        mockWeeklyRetrospects,
        mockOverallGoal,
      );

      expect(advice.canGenerateAdvice()).toBe(true);
    });

    it('should return false when both input arrays are empty', () => {
      const advice = AdviceAggregate.create(
        mockUserId,
        mockPromptId,
        mockMentorType,
        [],
        [],
        mockOverallGoal,
      );

      expect(advice.canGenerateAdvice()).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('should return true when output is generated', () => {
      const advice = AdviceAggregate.create(
        mockUserId,
        mockPromptId,
        mockMentorType,
        mockRecentTodos,
        mockWeeklyRetrospects,
        mockOverallGoal,
      );

      advice.updateOutput('Generated advice content');
      expect(advice.isCompleted()).toBe(true);
    });

    it('should return false when output is empty', () => {
      const advice = AdviceAggregate.create(
        mockUserId,
        mockPromptId,
        mockMentorType,
        mockRecentTodos,
        mockWeeklyRetrospects,
        mockOverallGoal,
      );

      expect(advice.isCompleted()).toBe(false);
    });
  });
});
