import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { MentorType, IntimacyLevel } from '../../../common/enums';
import { MentorFactory } from '../factories/mentor.factory';
import { AIGeneratorRepository } from '../repositories/ai-generator.repository';
import { ValidationUtils } from '../../../common/utils';

export interface GenerateGoalCommand {
  mentorType: MentorType;
  pastTodos: string[];
  pastRetrospects: string[];
  overallGoal: string;
  intimacyLevel: IntimacyLevel;
}

export interface GoalResult {
  success: boolean;
  goal: string;
  isFallback: boolean;
  error?: string;
}

@Injectable()
export class GoalDomainService {
  constructor(
    private readonly mentorFactory: MentorFactory,
    private readonly aiGeneratorRepository: AIGeneratorRepository,
  ) {}

  async generateGoal(command: GenerateGoalCommand): Promise<GoalResult> {
    const mentor = this.mentorFactory.createMentor(command.mentorType);

    try {
      const context = mentor.generateGoalContext(
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
        command.intimacyLevel,
      );

      const prompt = context.toPrompt();
      const rawGoal = await this.aiGeneratorRepository.generateGoal(prompt);

      const goal = this.validateAndCleanGoal(rawGoal);

      return {
        success: true,
        goal,
        isFallback: false,
      };
    } catch (error) {
      return {
        success: false,
        goal: mentor.getFallbackGoal(),
        isFallback: true,
        error: error.message,
      };
    }
  }

  private validateAndCleanGoal(rawGoal: string): string {
    const sanitized = ValidationUtils.sanitizeResponse(rawGoal);

    if (!ValidationUtils.isValidGoalResponse(sanitized)) {
      throw new Error('Generated goal does not meet format requirements');
    }

    return sanitized;
  }

  // 비즈니스 규칙: 목표 적절성 검증
  validateGoalRealism(
    goal: string,
    pastTodos: string[],
    intimacyLevel: IntimacyLevel,
  ): boolean {
    const isRealistic = this.assessGoalRealism(goal, pastTodos);

    return match(intimacyLevel)
      .with(IntimacyLevel.HIGH, () => {
        // 높은 친밀도: 도전적이어도 OK
        return goal.length >= 10;
      })
      .with(IntimacyLevel.MEDIUM, () => {
        // 중간 친밀도: 현실적이면서 동기부여가 되는 목표
        return isRealistic && goal.length >= 10 && goal.length <= 20;
      })
      .with(IntimacyLevel.LOW, () => {
        // 낮은 친밀도: 달성 가능한 기본 목표
        return (
          (isRealistic && goal.includes('기본')) || goal.includes('꾸준히')
        );
      })
      .exhaustive();
  }

  private assessGoalRealism(goal: string, pastTodos: string[]): boolean {
    const goalComplexity = this.calculateGoalComplexity(goal);
    const userCapacity = this.estimateUserCapacity(pastTodos);

    return goalComplexity <= userCapacity * 1.2; // 20% 도전 여유
  }

  private calculateGoalComplexity(goal: string): number {
    // 목표 복잡도 계산 로직
    const complexWords = ['프로젝트', '완성', '마스터', '전문가'];
    const simpleWords = ['공부', '시작', '기본', '시도'];

    let complexity = 5; // 기본 복잡도

    complexWords.forEach((word) => {
      if (goal.includes(word)) complexity += 3;
    });

    simpleWords.forEach((word) => {
      if (goal.includes(word)) complexity -= 1;
    });

    return Math.max(1, complexity);
  }

  private estimateUserCapacity(pastTodos: string[]): number {
    // 사용자 역량 추정 로직
    if (pastTodos.length === 0) return 3; // 기본 역량
    if (pastTodos.length < 5) return 4; // 초급
    if (pastTodos.length < 15) return 6; // 중급
    return 8; // 고급
  }
}
