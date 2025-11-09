import { Inject, Injectable, Logger } from '@nestjs/common';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import {
  NotFoundException,
  ValidationException,
} from '../../../common/exceptions';
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
  private readonly logger = new Logger(GoalRecommendationDomainService.name);

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
      this.logger.log(
        `Generating goal recommendation for user ${command.userId}, prompt ${command.promptId}`,
      );

      const promptInfo = await this.promptInfoService.getPromptInfoByPromptId(
        command.promptId,
      );

      if (!promptInfo) {
        throw new NotFoundException('Prompt template', command.promptId);
      }

      if (!promptInfo.mentorType) {
        throw new ValidationException(
          `Cannot extract mentor type from promptId: ${command.promptId}`,
          {
            code: 'MISSING_MENTOR_TYPE',
            details: { promptId: command.promptId },
          },
        );
      }

      const validationResult =
        ValidationUtils.validateGoalRecommendationInput(command);
      if (!validationResult.isValid) {
        throw new ValidationException(
          `Invalid input data: ${validationResult.errors.join(', ')}`,
          {
            code: 'INVALID_GOAL_INPUT',
            details: { errors: validationResult.errors },
          },
        );
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

      this.logger.log(
        `Successfully generated goal recommendation for user ${command.userId}`,
      );

      return {
        success: true,
        entity,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate goal recommendation: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        entity: null,
        error: error.message,
      };
    }
  }
}
