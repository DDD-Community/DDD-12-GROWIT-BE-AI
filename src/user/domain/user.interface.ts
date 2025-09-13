import { CommonInterface } from '@/common/common.interface';
import { CareerYear } from './vo/career-year';

export interface UserInterface extends CommonInterface {
  id: string;
  email: string;
  name: string;
  jobRoleId?: string;
  careerYear: CareerYear;
  mentorType?: string;
  isDeleted: boolean;
  isOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserProfileInterface {
  id: string;
  email: string;
  name: string;
  careerYear: CareerYear;
  jobRoleId?: string;
}

export interface UserStatsInterface {
  totalTodos: number;
  completedTodos: number;
  totalGoals: number;
  completedGoals: number;
}

export interface UserProfileWithStatsInterface
  extends UserProfileInterface,
    UserStatsInterface {}
