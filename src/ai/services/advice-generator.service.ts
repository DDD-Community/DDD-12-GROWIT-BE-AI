import { Injectable, Logger } from '@nestjs/common';
import { MentorType } from '../domain/value-objects/mentor-type.vo';
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
      // 데이터베이스에서 프롬프트 정보 조회
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

      // 프롬프트 ID에서 멘토 타입을 추출하여 폴백 사용
      const mentorType =
        this.promptTemplateService.extractMentorTypeFromPromptId(promptId);
      const fallbackAdvice = mentorType
        ? this.getSimpleFallback(mentorType)
        : '조언을 생성할 수 없습니다. 다시 시도해주세요.';

      this.logger.warn(`Using fallback advice: ${fallbackAdvice}`);

      return fallbackAdvice;
    }
  }

  private getSimpleFallback(mentorType: MentorType): string {
    const fallbacks = {
      [MentorType['피터 레벨스']]:
        '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.',
      [MentorType['젠슨 황']]:
        '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.',
      [MentorType.워렌버핏]:
        '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.',
    };
    return fallbacks[mentorType];
  }
}
