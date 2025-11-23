import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  ValidationException,
} from '../../../common/exceptions';
import { RetryUtils, StringUtils } from '../../../common/utils';
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
    this.logger.log(`Generating goal recommendation for prompt: ${promptId}`);

    const promptInfo =
      await this.promptTemplateService.getPromptInfoByPromptId(promptId);

    if (!promptInfo) {
      throw new NotFoundException('Prompt template', promptId);
    }

    if (promptInfo.type !== 'goal') {
      throw new ValidationException(
        `Invalid prompt type for goal recommendation: ${promptInfo.type}`,
        {
          code: 'INVALID_PROMPT_TYPE',
          details: { promptId, type: promptInfo.type },
        },
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

    const goal = await RetryUtils.retry(
      () => this.openaiService.generateGoal(prompt),
      {
        maxAttempts: 3,
        delayMs: 1000,
        exponentialBackoff: true,
        onRetry: (error, attempt) => {
          this.logger.warn(
            `Goal generation retry (attempt ${attempt}): ${error.message}`,
          );
        },
      },
    );

    this.logger.log(
      `Generated goal for prompt ${promptId}: ${StringUtils.truncate(goal, 100)}`,
    );

    return goal;
  }
}
