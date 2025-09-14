import { SpringUserData } from '../../../common/interfaces';

export abstract class SpringIntegrationRepository {
  abstract getActiveUsers(): Promise<SpringUserData[]>;
  abstract getUserData(userId: string): Promise<SpringUserData | null>;
  abstract saveAdvice(
    userId: string,
    advice: string,
    mentorType: string,
  ): Promise<boolean>;
  abstract saveGoal(
    userId: string,
    weeklyGoal: string,
    mentorType: string,
  ): Promise<boolean>;
}
