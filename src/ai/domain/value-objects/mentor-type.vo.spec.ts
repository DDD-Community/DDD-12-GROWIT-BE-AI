import { MentorTypeVO } from './mentor-type.vo';

describe('MentorTypeVO', () => {
  describe('create', () => {
    it('should create MentorTypeVO with valid mentor types', () => {
      const mentorTypeVO1 = MentorTypeVO.create('피터 레벨스');
      const mentorTypeVO2 = MentorTypeVO.create('젠슨 황');
      const mentorTypeVO3 = MentorTypeVO.create('워렌버핏');

      expect(mentorTypeVO1.getValue()).toBe('피터 레벨스');
      expect(mentorTypeVO2.getValue()).toBe('젠슨 황');
      expect(mentorTypeVO3.getValue()).toBe('워렌버핏');
    });

    it('should throw error for invalid mentor types', () => {
      expect(() => MentorTypeVO.create('invalid-mentor')).toThrow(
        'Invalid mentor type: invalid-mentor',
      );
      expect(() => MentorTypeVO.create('')).toThrow('Invalid mentor type: ');
      expect(() => MentorTypeVO.create(null as any)).toThrow(
        'Invalid mentor type: null',
      );
    });
  });

  describe('equals', () => {
    it('should return true for same mentor types', () => {
      const mentorTypeVO1 = MentorTypeVO.create('피터 레벨스');
      const mentorTypeVO2 = MentorTypeVO.create('피터 레벨스');
      expect(mentorTypeVO1.equals(mentorTypeVO2)).toBe(true);
    });

    it('should return false for different mentor types', () => {
      const mentorTypeVO1 = MentorTypeVO.create('피터 레벨스');
      const mentorTypeVO2 = MentorTypeVO.create('젠슨 황');
      expect(mentorTypeVO1.equals(mentorTypeVO2)).toBe(false);
    });
  });
});
