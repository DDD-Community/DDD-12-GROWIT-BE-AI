import { MentorType } from '../enums';

export interface SpringUserData {
  userId: string;
  mentorType: MentorType;
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
