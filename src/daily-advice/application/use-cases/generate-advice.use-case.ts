import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../../ai/application/services/openai.service';
import { PromptTemplateService } from '../../../ai/application/services/prompt-template.service';
import { TemplateBasedGeneratorService } from '../../../ai/application/services/template-based-generator.service';
import { AdviceAggregate } from '../../domain/advice.domain';
import { AdviceRepository } from '../../domain/advice.repository';
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
    private readonly promptTemplateService: PromptTemplateService,
    private readonly openaiService: OpenAIService,
    private readonly templateBasedGenerator: TemplateBasedGeneratorService,
  ) {}

  async execute(command: GenerateAdviceCommand): Promise<GenerateAdviceResult> {
    this.logger.log(
      `Generating advice for user ${command.userId} with mentor ${command.mentorType}`,
    );

    try {
      let domainResult: GenerateAdviceResult;

      if (command.templateUid) {
        domainResult = await this.generateWithTemplate(command);
      } else {
        domainResult = await this.adviceDomainService.generateAdvice({
          userId: command.userId,
          promptId: command.promptId,
          input: {
            recentTodos: command.recentTodos,
            weeklyRetrospects: command.weeklyRetrospects,
            overallGoal: command.overallGoal,
          },
        });
      }

      if (!domainResult.success) {
        this.logger.error(
          `Domain validation failed for user ${command.userId}: ${domainResult.error}`,
        );
        return domainResult;
      }

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

  private async generateWithTemplate(
    command: GenerateAdviceCommand,
  ): Promise<GenerateAdviceResult> {
    try {
      const template = await this.promptTemplateService.getTemplateByUid(
        command.templateUid!,
      );
      if (!template) {
        return {
          success: false,
          entity: null,
          error: `Template with UID ${command.templateUid} not found`,
        };
      }

      const adviceEntity = AdviceAggregate.create(
        command.userId,
        command.promptId,
        command.mentorType,
        command.recentTodos,
        command.weeklyRetrospects,
        command.overallGoal,
      );

      const basePrompt = template.generateFullPrompt();
      const contextualPrompt = this.buildContextualPrompt(
        basePrompt,
        command.mentorType,
        command.recentTodos,
        command.weeklyRetrospects,
        command.overallGoal,
      );

      const generatedAdvice =
        await this.openaiService.generateAdvice(contextualPrompt);

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

  private buildContextualPrompt(
    basePrompt: string,
    mentorType: string,
    recentTodos: string[],
    weeklyRetrospects: string[],
    overallGoal: string,
  ): string {
    const context = `
사용자 정보:
- 멘토 타입: ${mentorType}
- 최근 할 일: ${recentTodos.join(', ')}
- 주간 회고: ${weeklyRetrospects.join(', ')}
- 전체 목표: ${overallGoal}

${basePrompt}

위 정보를 바탕으로 ${mentorType} 멘토의 관점에서 조언을 제공해주세요.
`;

    return context;
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
