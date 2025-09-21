import { Inject, Injectable } from '@nestjs/common';
import { MentorType } from '../../../ai/domain/value-objects/mentor-type.vo';
import { AdviceGenerator } from '../../../ai/services/advice-generator.service';
import { PromptTemplateService } from '../../../ai/services/prompt-template.service';
import { AdviceAggregate, AdviceInput } from '../advice.domain';

export interface GenerateAdviceCommand {
  userId: string;
  promptId: string;
  input: Omit<AdviceInput, 'mentorType'>;
}

export interface AdviceResult {
  success: boolean;
  entity: AdviceAggregate | null;
  error?: string;
}

@Injectable()
export class AdviceDomainService {
  constructor(
    @Inject('AdviceGenerator')
    private readonly adviceGenerator: AdviceGenerator,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async generateAdvice(command: GenerateAdviceCommand): Promise<AdviceResult> {
    try {
      // promptId를 통해 프롬프트 정보 조회
      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(
          command.promptId,
        );

      if (!promptInfo) {
        return {
          success: false,
          entity: null,
          error: `Prompt template not found for promptId: ${command.promptId}`,
        };
      }

      if (!promptInfo.mentorType) {
        return {
          success: false,
          entity: null,
          error: `Cannot extract mentor type from promptId: ${command.promptId}`,
        };
      }

      const entity = AdviceAggregate.create(
        command.userId,
        command.promptId,
        promptInfo.mentorType,
        command.input.recentTodos,
        command.input.weeklyRetrospects,
        command.input.overallGoal,
      );

      if (!this.validateInput(command.input)) {
        return {
          success: false,
          entity,
          error: 'Invalid input data',
        };
      }

      const generatedAdvice =
        await this.adviceGenerator.generateAdviceByPromptId(
          command.promptId,
          command.input.overallGoal,
          [], // completedTodos - 현재 요청에는 없음
          command.input.recentTodos, // incompleteTodos로 사용
          [], // pastWeeklyGoals - 현재 요청에는 없음
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
        entity: null,
        error: error.message,
      };
    }
  }

  private validateInput(input: Omit<AdviceInput, 'mentorType'>): boolean {
    return (
      Array.isArray(input.recentTodos) &&
      Array.isArray(input.weeklyRetrospects) &&
      input.overallGoal &&
      input.overallGoal.length > 0
    );
  }

  private getFallbackAdvice(mentorType: MentorType): string {
    switch (mentorType) {
      case MentorType['피터 레벨스']:
        return '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.';
      case MentorType['젠슨 황']:
        return '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.';
      case MentorType.워렌버핏:
        return '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.';
      default:
        return '오늘도 꾸준히 노력해보자.';
    }
  }
}
