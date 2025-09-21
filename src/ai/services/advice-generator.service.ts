import { Injectable, Logger } from '@nestjs/common';
import { MentorType } from '../domain/value-objects/mentor-type.vo';
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
  ): Promise<string> {
    try {
      const prompt = await this.promptTemplateService.generateAdvicePrompt(
        mentorType,
        recentTodos,
        weeklyRetrospects,
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

      const fallbackAdvice = this.getSimpleFallback(mentorType);
      this.logger.warn(`Using fallback advice: ${fallbackAdvice}`);

      return fallbackAdvice;
    }
  }

  private getSimpleFallback(mentorType: MentorType): string {
    const fallbacks = {
      [MentorType.팀쿡]:
        '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.',
      [MentorType.공자]:
        '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.',
      [MentorType.워렌버핏]:
        '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.',
    };
    return fallbacks[mentorType];
  }
}
