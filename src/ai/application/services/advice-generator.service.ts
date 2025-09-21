import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

export interface AdviceGenerator {
  generateAdviceByPromptId(
    promptId: string,
    overallGoal: string,
    completedTodos: string[],
    incompleteTodos: string[],
    pastWeeklyGoals: string[],
    weeklyRetrospects: string[],
  ): Promise<string>;
}

@Injectable()
export class AdviceGeneratorService implements AdviceGenerator {
  private readonly logger = new Logger(AdviceGeneratorService.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async generateAdviceByPromptId(
    promptId: string,
    overallGoal: string,
    completedTodos: string[],
    incompleteTodos: string[],
    pastWeeklyGoals: string[],
    weeklyRetrospects: string[],
  ): Promise<string> {
    try {
      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(promptId);

      if (!promptInfo) {
        throw new Error(`Prompt template not found: ${promptId}`);
      }

      if (promptInfo.type !== '조언') {
        throw new Error(
          `Invalid prompt type for advice generation: ${promptInfo.type}`,
        );
      }

      const prompt =
        await this.promptTemplateService.generateAdvicePromptByPromptId(
          promptId,
          overallGoal,
          completedTodos,
          incompleteTodos,
          pastWeeklyGoals,
          weeklyRetrospects,
        );

      const advice = await this.openaiService.generateAdvice(prompt);
      this.logger.log(
        `Generated advice for prompt ${promptId}: ${advice.substring(0, 50)}...`,
      );

      return advice;
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for prompt ${promptId}:`,
        error.message,
      );

      const fallbackAdvice = '조언을 생성할 수 없습니다. 다시 시도해주세요.';

      this.logger.warn(`Using fallback advice: ${fallbackAdvice}`);

      return fallbackAdvice;
    }
  }
}
