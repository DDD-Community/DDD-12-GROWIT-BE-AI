import { Inject, Injectable, Logger } from '@nestjs/common';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import {
  AdviceResult,
  GenerateAdviceCommand,
} from '../../application/commands/generate-advice.command';
import { AdviceAggregate } from '../advice.domain';
import { AdviceGenerator } from './advice-generator.interface';

@Injectable()
export class AdviceTemplateDomainService {
  private readonly logger = new Logger(AdviceTemplateDomainService.name);

  constructor(
    @Inject('PromptInfoService')
    private readonly promptInfoService: PromptInfoService,
    @Inject('AdviceGenerator')
    private readonly adviceGenerator: AdviceGenerator,
  ) {}

  async generateWithTemplate(
    command: GenerateAdviceCommand,
  ): Promise<AdviceResult> {
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

      const adviceEntity = AdviceAggregate.create(
        command.userId,
        command.promptId,
        promptInfo.mentorType,
        command.recentTodos,
        command.weeklyRetrospects,
        command.overallGoal,
      );

      const generatedAdvice =
        await this.adviceGenerator.generateAdviceByPromptId(
          command.promptId,
          command.overallGoal,
          [],
          command.recentTodos,
          [],
          command.weeklyRetrospects,
        );

      adviceEntity.updateOutput(generatedAdvice);

      return {
        success: true,
        entity: adviceEntity,
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
