import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { IntimacyLevel, MentorType } from '../../../common/enums';
import { ValidationUtils } from '../../../common/utils';
import { MentorFactory } from '../factories/mentor.factory';
import { AIGeneratorRepository } from '../repositories/ai-generator.repository';

export interface GenerateAdviceCommand {
  mentorType: MentorType;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal: string;
  intimacyLevel: IntimacyLevel;
}

export interface AdviceResult {
  success: boolean;
  advice: string;
  isFallback: boolean;
  error?: string;
}

@Injectable()
export class AdviceDomainService {
  constructor(
    private readonly mentorFactory: MentorFactory,
    private readonly aiGeneratorRepository: AIGeneratorRepository,
  ) {}

  async generateAdvice(command: GenerateAdviceCommand): Promise<AdviceResult> {
    const mentor = this.mentorFactory.createMentor(command.mentorType);

    try {
      const context = mentor.generateAdviceContext(
        command.recentTodos,
        command.weeklyRetrospects,
        command.intimacyLevel,
      );

      const prompt = context.toPrompt();
      const rawAdvice = await this.aiGeneratorRepository.generateAdvice(prompt);

      const advice = this.validateAndCleanAdvice(rawAdvice);

      return {
        success: true,
        advice,
        isFallback: false,
      };
    } catch (error) {
      return {
        success: false,
        advice: mentor.getFallbackAdvice(),
        isFallback: true,
        error: error.message,
      };
    }
  }

  private validateAndCleanAdvice(rawAdvice: string): string {
    const sanitized = ValidationUtils.sanitizeResponse(rawAdvice);

    if (!ValidationUtils.isValidAdviceResponse(sanitized)) {
      throw new Error('Generated advice does not meet format requirements');
    }

    return sanitized;
  }

  // 비즈니스 규칙: 친밀도에 따른 조언 검증
  validateAdviceQuality(advice: string, intimacyLevel: IntimacyLevel): boolean {
    const sentenceCount = advice
      .split(/[.!?]/)
      .filter((s) => s.trim().length > 0).length;

    return match(intimacyLevel)
      .with(IntimacyLevel.HIGH, () => {
        // 높은 친밀도: 더 구체적이고 도전적인 내용이어야 함
        return sentenceCount >= 2 && advice.length > 50;
      })
      .with(IntimacyLevel.MEDIUM, () => {
        // 중간 친밀도: 기본 요구사항 충족
        return sentenceCount >= 2 && sentenceCount <= 3;
      })
      .with(IntimacyLevel.LOW, () => {
        // 낮은 친밀도: 격려 위주, 부담스럽지 않게
        return (
          (sentenceCount >= 2 && advice.includes('격려')) ||
          advice.includes('천천히')
        );
      })
      .exhaustive();
  }
}
