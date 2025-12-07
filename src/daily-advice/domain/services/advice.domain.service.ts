import { Inject, Injectable, Logger } from '@nestjs/common';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import {
  NotFoundException,
  ValidationException,
} from '../../../common/exceptions';
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
  private readonly logger = new Logger(AdviceDomainService.name);

  constructor(
    @Inject('AdviceGenerator')
    private readonly adviceGenerator: AdviceGenerator,
    @Inject('PromptInfoService')
    private readonly promptInfoService: PromptInfoService,
  ) {}

  async generateAdvice(command: GenerateAdviceCommand): Promise<AdviceResult> {
    try {
      this.logger.log(
        `Generating advice for user ${command.userId}, prompt ${command.promptId}`,
      );

      const promptInfo = await this.promptInfoService.getPromptInfoByPromptId(
        command.promptId,
      );

      if (!promptInfo) {
        throw new NotFoundException('Prompt template', command.promptId);
      }

      if (!promptInfo.mentorType) {
        throw new ValidationException(
          `Cannot extract mentor type from promptId: ${command.promptId}`,
          {
            code: 'MISSING_MENTOR_TYPE',
            details: { promptId: command.promptId },
          },
        );
      }

      const validationResult = ValidationUtils.validateAdviceInput(
        command.input,
      );
      if (!validationResult.isValid) {
        throw new ValidationException(
          `Invalid input data: ${validationResult.errors.join(', ')}`,
          {
            code: 'INVALID_ADVICE_INPUT',
            details: { errors: validationResult.errors },
          },
        );
      }

      const entity = AdviceAggregate.create(
        command.userId,
        command.promptId,
        promptInfo.mentorType,
        command.input.recentTodos,
        command.input.weeklyRetrospects,
        command.input.overallGoal,
      );

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

      this.logger.log(
        `Successfully generated advice for user ${command.userId}`,
      );

      return {
        success: true,
        entity,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate advice: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        entity: null,
        error: error.message,
      };
    }
  }
}
