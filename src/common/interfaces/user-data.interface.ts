import { MentorType } from '../../ai/domain/value-objects/mentor-type.vo';

export interface UserDataInterface {
  userId: string;
  mentorType: MentorType;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal?: string;
}
