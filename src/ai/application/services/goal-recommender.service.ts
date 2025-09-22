import { Injectable, Logger } from '@nestjs/common';
import { GoalRecommender } from '../../../goal-recommendation/domain/services/goal-recommender.interface';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

@Injectable()
export class GoalRecommenderService implements GoalRecommender {
  private readonly logger = new Logger(GoalRecommenderService.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async recommendGoalByPromptId(
    promptId: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    completedTodos?: string[],
    pastWeeklyGoals?: string[],
    remainingTime?: string,
  ): Promise<string> {
    try {
      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(promptId);

      if (!promptInfo) {
        throw new Error(`Prompt template not found: ${promptId}`);
      }

      if (promptInfo.type !== 'goal') {
        throw new Error(
          `Invalid prompt type for goal recommendation: ${promptInfo.type}`,
        );
      }

      const prompt =
        await this.promptTemplateService.generateGoalPromptByPromptId(
          promptId,
          pastTodos,
          pastRetrospects,
          overallGoal,
          completedTodos,
          pastWeeklyGoals,
          remainingTime,
        );

      const goal = await this.openaiService.generateGoal(prompt);
      this.logger.log(`Generated goal for prompt ${promptId}: ${goal}`);

      return goal;
    } catch (error) {
      this.logger.error(
        `Failed to generate goal for prompt ${promptId}:`,
        error.message,
      );

      throw error;
    }
  }
}
