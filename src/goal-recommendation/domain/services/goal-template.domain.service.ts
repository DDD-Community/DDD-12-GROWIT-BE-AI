import { Inject, Injectable, Logger } from '@nestjs/common';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import {
  GenerateGoalRecommendationCommand,
  GoalRecommendationResult,
} from '../../application/commands/generate-goal-recommendation.command';
import { GoalRecommendationAggregate } from '../goal-recommendation.domain';
import { GoalRecommender } from './goal-recommender.interface';

@Injectable()
export class GoalTemplateDomainService {
  private readonly logger = new Logger(GoalTemplateDomainService.name);

  constructor(
    @Inject('PromptInfoService')
    private readonly promptInfoService: PromptInfoService,
    @Inject('GoalRecommender')
    private readonly goalRecommender: GoalRecommender,
  ) {}

  async generateWithTemplate(
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

      const goalEntity = GoalRecommendationAggregate.create(
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

      const generatedGoal = await this.goalRecommender.recommendGoalByPromptId(
        command.promptId,
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
        command.completedTodos,
        command.pastWeeklyGoals,
        command.remainingTime,
      );

      goalEntity.updateOutput(generatedGoal);

      return {
        success: true,
        entity: goalEntity,
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
