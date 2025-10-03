import { Inject, Injectable } from '@nestjs/common';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import { ValidationUtils } from '../../../common/utils/validation.utils';
import { AdviceAggregate, AdviceInput } from '../advice.domain';
import { AdviceGenerator } from './advice-generator.interface';

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
        command.input.completedTodos,
        command.input.incompleteTodos,
        command.input.pastWeeklyGoals,
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
          command.input.completedTodos,
          command.input.incompleteTodos,
          command.input.pastWeeklyGoals,
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
}
