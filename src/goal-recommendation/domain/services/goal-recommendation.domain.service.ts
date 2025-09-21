import { Inject, Injectable } from '@nestjs/common';
import { MentorType } from '../../../ai/domain/value-objects/mentor-type.vo';
import { GoalRecommender } from '../../../ai/services/goal-recommender.service';
import { PromptTemplateService } from '../../../ai/services/prompt-template.service';
import { GoalRecommendationAggregate } from '../goal-recommendation.domain';

export interface GenerateGoalRecommendationCommand {
  userId: string;
  promptId: string;
  pastTodos: string[];
  pastRetrospects: string[];
  overallGoal: string;
  completedTodos?: string[];
  pastWeeklyGoals?: string[];
  remainingTime?: string;
  templateUid?: string;
}

export interface GoalRecommendationResult {
  success: boolean;
  entity: GoalRecommendationAggregate | null;
  error?: string;
}

@Injectable()
export class GoalRecommendationDomainService {
  constructor(
    @Inject('GoalRecommender')
    private readonly goalRecommender: GoalRecommender,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async generateGoalRecommendation(
    command: GenerateGoalRecommendationCommand,
  ): Promise<GoalRecommendationResult> {
    try {
      // promptId를 통해 프롬프트 정보 조회
      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(
          command.promptId,
        );

      if (!promptInfo) {
        return {
          success: false,
          entity: null,
          error: `Prompt template not found for promptId: ${command.promptId}`,
        };
      }

      if (!promptInfo.mentorType) {
        return {
          success: false,
          entity: null,
          error: `Cannot extract mentor type from promptId: ${command.promptId}`,
        };
      }

      const entity = GoalRecommendationAggregate.create(
        command.userId,
        command.promptId,
        promptInfo.mentorType,
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
        command.completedTodos,
        command.pastWeeklyGoals,
        command.remainingTime,
      );

      // 입력 검증
      if (!this.validateInput(command)) {
        return {
          success: false,
          entity,
          error: 'Invalid input data',
        };
      }

      // AI 목표 추천 생성
      const recommendedGoal =
        await this.goalRecommender.recommendGoalByPromptId(
          command.promptId,
          command.pastTodos,
          command.pastRetrospects,
          command.overallGoal,
          command.completedTodos,
          command.pastWeeklyGoals,
          command.remainingTime,
        );
      entity.updateOutput(recommendedGoal);

      return {
        success: true,
        entity,
      };
    } catch (error) {
      return {
        success: false,
        entity: null,
        error: error.message,
      };
    }
  }

  private validateInput(command: GenerateGoalRecommendationCommand): boolean {
    return (
      Array.isArray(command.pastTodos) &&
      Array.isArray(command.pastRetrospects) &&
      command.overallGoal &&
      command.overallGoal.length > 0
    );
  }

  private getFallbackGoal(mentorType: MentorType): string {
    switch (mentorType) {
      case MentorType['피터 레벨스']:
        return '이번 주 프로젝트 진행하기';
      case MentorType['젠슨 황']:
        return '이번 주 꾸준히 학습하기';
      case MentorType.워렌버핏:
        return '이번 주 투자 공부하기';
      default:
        return '이번 주 목표 달성하기';
    }
  }
}
