import { Inject, Injectable } from '@nestjs/common';
import { MentorType } from '../../../common/enums/mentor-type.enum';
import {
  GoalRecommendationAggregate,
  GoalRecommendationInput,
} from '../goal-recommendation.domain';

export interface GenerateGoalRecommendationCommand {
  userId: string;
  promptId: string;
  input: GoalRecommendationInput;
}

export interface GoalRecommendationResult {
  success: boolean;
  entity: GoalRecommendationAggregate | null;
  error?: string;
}

export interface GoalRecommender {
  recommendGoal(
    mentorType: MentorType,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): Promise<string>;
}

@Injectable()
export class GoalRecommendationDomainService {
  constructor(
    @Inject('GoalRecommender')
    private readonly goalRecommender: GoalRecommender,
  ) {}

  async generateGoalRecommendation(
    command: GenerateGoalRecommendationCommand,
  ): Promise<GoalRecommendationResult> {
    try {
      // 도메인 비즈니스 로직
      const entity = GoalRecommendationAggregate.create(
        command.userId,
        command.promptId,
        command.input.mentorType.toString(),
        command.input.pastTodos,
        command.input.pastRetrospects,
        command.input.overallGoal,
      );

      // 입력 검증
      if (!this.validateInput(command.input)) {
        return {
          success: false,
          entity,
          error: 'Invalid input data',
        };
      }

      // AI 목표 추천 생성
      const mentorTypeValue = command.input.mentorType.getCommonMentorType();
      const recommendedGoal = await this.goalRecommender.recommendGoal(
        mentorTypeValue,
        command.input.pastTodos,
        command.input.pastRetrospects,
        command.input.overallGoal,
      );
      entity.updateOutput(recommendedGoal);

      return {
        success: true,
        entity,
      };
    } catch (error) {
      return {
        success: false,
        entity: GoalRecommendationAggregate.create(
          command.userId,
          command.promptId,
          command.input.mentorType.toString(),
          command.input.pastTodos,
          command.input.pastRetrospects,
          command.input.overallGoal,
        ),
        error: error.message,
      };
    }
  }

  private validateInput(input: GoalRecommendationInput): boolean {
    return (
      input.mentorType &&
      Array.isArray(input.pastTodos) &&
      Array.isArray(input.pastRetrospects) &&
      input.overallGoal &&
      input.overallGoal.length > 0
    );
  }

  private getFallbackGoal(mentorType: MentorType): string {
    switch (mentorType) {
      case MentorType.팀쿡:
        return '이번 주 프로젝트 진행하기';
      case MentorType.공자:
        return '이번 주 꾸준히 학습하기';
      case MentorType.워렌버핏:
        return '이번 주 투자 공부하기';
      default:
        return '이번 주 목표 달성하기';
    }
  }
}
