import { CommonInterface } from '@/common/common.interface';

export interface RetrospectInterface extends CommonInterface {
  id: string;
  userId: string;
  goalId: string;
  planId?: string;
  content: string;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface GoalRetrospectInterface extends CommonInterface {
  id: string;
  goalId: string;
  todoCompletedRate: number;
  analysisSummary: string;
  analysisAdvice: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface RetrospectWeeklyInterface {
  userId: string;
  weekStartDate: string;
  weekEndDate: string;
  totalTodos: number;
  completedTodos: number;
  totalGoals: number;
  completedGoals: number;
  averageCompletionRate: number;
}
