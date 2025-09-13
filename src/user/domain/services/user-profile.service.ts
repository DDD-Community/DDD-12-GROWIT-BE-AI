import { Injectable } from '@nestjs/common';
import { RetrospectRepository } from '../../../retrospect/infrastructure/persistence/retrospect.repository';
import { TodoRepository } from '../../../todo/infrastructure/persistence/todo.repository';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { UserProfileWithStatsInterface } from '../user.interface';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly todoRepository: TodoRepository,
    private readonly retrospectRepository: RetrospectRepository,
  ) {}

  async getUserProfileWithStats(
    userId: string,
  ): Promise<UserProfileWithStatsInterface | null> {
    const user = await this.userRepository.findUserProfileById(userId);
    if (!user) return null;

    // 비즈니스 로직: 통계 데이터 계산
    const [totalTodos, completedTodos, totalGoals, completedGoals] =
      await Promise.all([
        this.todoRepository.countByUserId(userId),
        this.todoRepository.countCompletedByUserId(userId),
        this.retrospectRepository.countByUserId(userId),
        this.retrospectRepository.countCompletedByUserId(userId),
      ]);

    return {
      ...user,
      totalTodos,
      completedTodos,
      totalGoals,
      completedGoals,
    };
  }
}
