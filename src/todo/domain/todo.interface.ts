import { CommonInterface } from '@/common/common.interface';

export interface TodoInterface extends CommonInterface {
  id: string;
  userId: string;
  planId: string;
  goalId: string;
  date: Date;
  content: string;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
