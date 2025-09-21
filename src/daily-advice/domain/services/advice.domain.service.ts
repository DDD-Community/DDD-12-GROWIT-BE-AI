import { Inject, Injectable } from '@nestjs/common';
import { AdviceGenerator } from '../../../ai/application/services/advice-generator.service';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import { MentorType } from '../../../ai/domain/value-objects/mentor-type.vo';
import { ValidationUtils } from '../../../common/utils/validation.utils';
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
    @Inject('PromptInfoService')
    private readonly promptInfoService: PromptInfoService,
  ) {}

  async generateAdvice(command: GenerateAdviceCommand): Promise<AdviceResult> {
    try {
      const promptInfo = await this.promptInfoService.getPromptInfoByPromptId(
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

      const validationResult = ValidationUtils.validateAdviceInput(
        command.input,
      );
      if (!validationResult.isValid) {
        return {
          success: false,
          entity,
          error: `Invalid input data: ${validationResult.errors.join(', ')}`,
        };
      }

      const generatedAdvice =
        await this.adviceGenerator.generateAdviceByPromptId(
          command.promptId,
          command.input.overallGoal,
          [],
          command.input.recentTodos,
          [],
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
