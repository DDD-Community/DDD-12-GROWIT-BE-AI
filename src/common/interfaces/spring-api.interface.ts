import { MentorType, IntimacyLevel } from '../enums';

export interface SpringUserData {
  userId: string;
  mentorType: MentorType;
  intimacyLevel: IntimacyLevel;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal?: string;
}

export interface SpringBatchRequest {
  users: SpringUserData[];
}

export interface SpringBatchResponse {
  success: boolean;
  processedUsers: number;
  errors: string[];
}
