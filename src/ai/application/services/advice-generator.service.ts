import { StructuredAdviceResponseDto } from '@/ai/dto';
import { Injectable, Logger } from '@nestjs/common';
import { AdviceGenerator } from '../../../daily-advice/domain/services/advice-generator.interface';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

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
  ): Promise<StructuredAdviceResponseDto> {
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

      const adviceResponse = await this.openaiService.generateAdvice(prompt);
      this.logger.log(
        `Generated advice for prompt ${promptId}: ${JSON.stringify(adviceResponse).substring(0, 100)}...`,
      );

      return adviceResponse;
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for prompt ${promptId}:`,
        error.message,
      );

      throw error;
    }
  }
}
