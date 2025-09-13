import { Injectable, Logger } from '@nestjs/common';
import { MentorType, IntimacyLevel } from '../../common/enums';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

@Injectable()
export class AdviceGeneratorService {
  private readonly logger = new Logger(AdviceGeneratorService.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async generateAdvice(
    mentorType: MentorType,
    recentTodos: string[],
    weeklyRetrospects: string[],
    intimacyLevel: IntimacyLevel,
  ): Promise<string> {
    try {
      const prompt = this.promptTemplateService.generateAdvicePrompt(
        mentorType,
        recentTodos,
        weeklyRetrospects,
        intimacyLevel,
      );

      const advice = await this.openaiService.generateAdvice(prompt);
      this.logger.log(
        `Generated advice for mentor ${mentorType}: ${advice.substring(0, 50)}...`,
      );

      return advice;
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for mentor ${mentorType}:`,
        error.message,
      );

      const fallbackAdvice =
        this.promptTemplateService.getFallbackAdvice(mentorType);
      this.logger.warn(`Using fallback advice: ${fallbackAdvice}`);

      return fallbackAdvice;
    }
  }
}
