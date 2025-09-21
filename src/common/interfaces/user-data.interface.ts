import { MentorType } from '../../ai/domain/value-objects/mentor-type.vo';

export interface UserDataInterface {
  userId: string;
  mentorType: MentorType;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal?: string;
}

export interface TodoData {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface RetrospectData {
  id: string;
  content: string;
  weekStartDate: Date;
  createdAt: Date;
}
