import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

export interface GoalRecommender {
  recommendGoalByPromptId(
    promptId: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    completedTodos?: string[],
    pastWeeklyGoals?: string[],
    remainingTime?: string,
  ): Promise<string>;
}

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

      if (promptInfo.type !== '목표추천') {
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

      const fallbackGoal = '이번 주 목표 설정하기';

      this.logger.warn(`Using fallback goal: ${fallbackGoal}`);

      return fallbackGoal;
    }
  }
}
