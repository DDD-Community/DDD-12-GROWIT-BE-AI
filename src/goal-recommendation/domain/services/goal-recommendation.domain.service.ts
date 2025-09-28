import { Inject, Injectable } from '@nestjs/common';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import { ValidationUtils } from '../../../common/utils/validation.utils';
import { GoalRecommendationAggregate } from '../goal-recommendation.domain';
import { GoalRecommender } from './goal-recommender.interface';

export interface GenerateGoalRecommendationCommand {
  userId: string;
  promptId: string;
  pastTodos: string[];
  pastRetrospects: string[];
  overallGoal: string;
  completedTodos?: string[];
  pastWeeklyGoals?: string[];
  remainingTime?: string;
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
    @Inject('PromptInfoService')
    private readonly promptInfoService: PromptInfoService,
  ) {}

  async generateGoalRecommendation(
    command: GenerateGoalRecommendationCommand,
  ): Promise<GoalRecommendationResult> {
    try {
      const promptInfo = await this.promptInfoService.getPromptInfoByPromptId(
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

      const validationResult =
        ValidationUtils.validateGoalRecommendationInput(command);
      if (!validationResult.isValid) {
        return {
          success: false,
          entity,
          error: `Invalid input data: ${validationResult.errors.join(', ')}`,
        };
      }

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
}
