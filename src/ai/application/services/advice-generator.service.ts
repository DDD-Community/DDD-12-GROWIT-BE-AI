import { StructuredAdviceResponseDto } from '@/ai/dto';
import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  ValidationException,
} from '../../../common/exceptions';
import { RetryUtils, StringUtils } from '../../../common/utils';
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
    this.logger.log(`Generating advice for prompt: ${promptId}`);

    const promptInfo =
      await this.promptTemplateService.getPromptInfoByPromptId(promptId);

    if (!promptInfo) {
      throw new NotFoundException('Prompt template', promptId);
    }

    if (promptInfo.type !== 'advice') {
      throw new ValidationException(
        `Invalid prompt type for advice generation: ${promptInfo.type}`,
        {
          code: 'INVALID_PROMPT_TYPE',
          details: { promptId, type: promptInfo.type },
        },
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

    const adviceResponse = await RetryUtils.retry(
      () => this.openaiService.generateAdvice(prompt),
      {
        maxAttempts: 3,
        delayMs: 1000,
        exponentialBackoff: true,
        onRetry: (error, attempt) => {
          this.logger.warn(
            `Advice generation retry (attempt ${attempt}): ${error.message}`,
          );
        },
      },
    );

    this.logger.log(
      `Generated advice for prompt ${promptId}: ${StringUtils.truncate(JSON.stringify(adviceResponse), 100)}`,
    );

    return adviceResponse;
  }
}
