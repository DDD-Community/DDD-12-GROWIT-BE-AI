import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../../ai/application/services/openai.service';
import { PromptInfoService } from '../../../ai/domain/services/prompt-info.service';
import { AdviceAggregate } from '../../domain/advice.domain';
import { AdviceRepository } from '../../domain/repositories/advice.repository';
import { AdviceTemplateDomainService } from '../../domain/services/advice-template.domain.service';
import { AdviceDomainService } from '../../domain/services/advice.domain.service';
import { GenerateAdviceCommand } from '../commands/generate-advice.command';

export interface GenerateAdviceResult {
  success: boolean;
  entity: AdviceAggregate | null;
  id?: string;
  error?: string;
}

@Injectable()
export class GenerateAdviceUseCase {
  private readonly logger = new Logger(GenerateAdviceUseCase.name);

  constructor(
    @Inject('AdviceRepository')
    private readonly adviceRepository: AdviceRepository,
    private readonly adviceDomainService: AdviceDomainService,
    private readonly adviceTemplateService: AdviceTemplateDomainService,
    @Inject('PromptInfoService')
    private readonly promptTemplateService: PromptInfoService,
    private readonly openaiService: OpenAIService,
  ) {}

  async execute(command: GenerateAdviceCommand): Promise<GenerateAdviceResult> {
    this.logger.log(
      `Generating advice for user ${command.userId} with mentor ${command.mentorType}`,
    );

    try {
      // 1. Domain Service를 통해 비즈니스 로직 실행
      const domainResult = command.promptId
        ? await this.adviceTemplateService.generateWithTemplate(command)
        : await this.adviceDomainService.generateAdvice({
            userId: command.userId,
            promptId: command.promptId,
            input: {
              recentTodos: command.recentTodos,
              weeklyRetrospects: command.weeklyRetrospects,
              overallGoal: command.overallGoal,
            },
          });

      if (!domainResult.success) {
        this.logger.error(
          `Domain validation failed for user ${command.userId}: ${domainResult.error}`,
        );
        return domainResult;
      }

      // 2. Repository를 통해 영속성 처리
      await this.adviceRepository.save(domainResult.entity);

      this.logger.log(
        `Successfully generated advice for user ${command.userId} with ID: ${domainResult.entity.uid}`,
      );

      return {
        ...domainResult,
        id: domainResult.entity.uid,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for user ${command.userId}: ${error.message}`,
      );

      return {
        success: false,
        entity: null,
        error: `AI service failed: ${error.message}`,
      };
    }
  }

  async getAdvice(uid: string): Promise<AdviceAggregate | null> {
    return await this.adviceRepository.findById(uid);
  }

  async getLatestAdviceByUserId(
    userId: string,
  ): Promise<AdviceAggregate | null> {
    return await this.adviceRepository.findLatestByUserId(userId);
  }

  async listAdvice(): Promise<AdviceAggregate[]> {
    return await this.adviceRepository.findAll();
  }

  async deleteAdvice(uid: string) {
    return await this.adviceRepository.delete(uid);
  }
}
