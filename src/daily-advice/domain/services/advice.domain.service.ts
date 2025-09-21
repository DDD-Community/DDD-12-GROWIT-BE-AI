import { Inject, Injectable } from '@nestjs/common';
import { MentorType } from '../../../ai/domain/value-objects/mentor-type.vo';
import { AdviceAggregate, AdviceInput } from '../advice.domain';

export interface GenerateAdviceCommand {
  userId: string;
  promptId: string;
  input: AdviceInput;
}

export interface AdviceResult {
  success: boolean;
  entity: AdviceAggregate | null;
  error?: string;
}

export interface AdviceGenerator {
  generateAdvice(
    mentorType: MentorType,
    recentTodos: string[],
    weeklyRetrospects: string[],
  ): Promise<string>;
}

@Injectable()
export class AdviceDomainService {
  constructor(
    @Inject('AdviceGenerator')
    private readonly adviceGenerator: AdviceGenerator,
  ) {}

  async generateAdvice(command: GenerateAdviceCommand): Promise<AdviceResult> {
    try {
      // 도메인 비즈니스 로직
      const entity = AdviceAggregate.create(
        command.userId,
        command.promptId,
        command.input.mentorType.toString(),
        command.input.recentTodos,
        command.input.weeklyRetrospects,
        command.input.overallGoal,
      );

      // 입력 검증
      if (!this.validateInput(command.input)) {
        return {
          success: false,
          entity,
          error: 'Invalid input data',
        };
      }

      // AI 조언 생성
      const mentorTypeValue = command.input.mentorType.getMentorType();
      const generatedAdvice = await this.adviceGenerator.generateAdvice(
        mentorTypeValue,
        command.input.recentTodos,
        command.input.weeklyRetrospects,
      );
      entity.updateOutput(generatedAdvice);

      return {
        success: true,
        entity,
      };
    } catch (error) {
      return {
        success: false,
        entity: AdviceAggregate.create(
          command.userId,
          command.promptId,
          command.input.mentorType.toString(),
          command.input.recentTodos,
          command.input.weeklyRetrospects,
          command.input.overallGoal,
        ),
        error: error.message,
      };
    }
  }

  private validateInput(input: AdviceInput): boolean {
    return (
      input.mentorType &&
      Array.isArray(input.recentTodos) &&
      Array.isArray(input.weeklyRetrospects) &&
      input.overallGoal &&
      input.overallGoal.length > 0
    );
  }

  private getFallbackAdvice(mentorType: MentorType): string {
    switch (mentorType) {
      case MentorType.팀쿡:
        return '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.';
      case MentorType.공자:
        return '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.';
      case MentorType.워렌버핏:
        return '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.';
      default:
        return '오늘도 꾸준히 노력해보자.';
    }
  }
}
