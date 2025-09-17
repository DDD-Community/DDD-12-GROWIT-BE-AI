import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../../ai/services/openai.service';
import { PromptTemplateService } from '../../../ai/services/prompt-template.service';
import { AdviceAggregate } from '../../domain/advice.domain';
import { AdviceRepository } from '../../domain/advice.repository';
import { AdviceDomainService } from '../../domain/services/advice.domain.service';
import { MentorTypeVO } from '../../domain/value-objects';
import { GenerateAdviceCommand } from '../commands/generate-advice.command';

export interface GenerateAdviceResult {
  success: boolean;
  entity: AdviceAggregate | null;
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
  ) {}

  async execute(command: GenerateAdviceCommand): Promise<GenerateAdviceResult> {
    this.logger.log(
      `Generating advice for user ${command.userId} with mentor ${command.mentorType}`,
    );

    try {
      let domainResult: GenerateAdviceResult;

      // 템플릿이 제공된 경우 템플릿 기반 생성
      if (command.templateUid) {
        domainResult = await this.generateWithTemplate(command);
      } else {
        // 기존 도메인 서비스 호출 (AI 생성 로직 포함)
        domainResult = await this.adviceDomainService.generateAdvice({
          userId: command.userId,
          promptId: command.promptId,
          input: {
            mentorType: MentorTypeVO.create(command.mentorType),
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

      // 엔티티 저장
      await this.adviceRepository.save(domainResult.entity);

      this.logger.log(
        `Successfully generated advice for user ${command.userId}`,
      );

      return domainResult;
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for user ${command.userId}: ${error.message}`,
      );

      // AI 실패 시 에러 응답 반환 (엔티티 저장하지 않음)
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
      // 1. 템플릿 조회
      const template = await this.promptTemplateService.getTemplate(
        command.templateUid!,
      );
      if (!template) {
        return {
          success: false,
          entity: null,
          error: `Template with UID ${command.templateUid} not found`,
        };
      }

      // 2. 조언 엔티티 생성
      const adviceEntity = AdviceAggregate.create(
        command.userId,
        command.promptId,
        command.mentorType,
        command.recentTodos,
        command.weeklyRetrospects,
        command.overallGoal,
      );

      // 3. 템플릿을 기반으로 프롬프트 생성
      const basePrompt = template.generateFullPrompt();
      const contextualPrompt = this.buildContextualPrompt(
        basePrompt,
        command.mentorType,
        command.recentTodos,
        command.weeklyRetrospects,
        command.overallGoal,
      );

      // 4. OpenAI API 호출
      const generatedAdvice =
        await this.openaiService.generateAdvice(contextualPrompt);

      // 5. 엔티티에 결과 업데이트
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

  async listAdvice(): Promise<AdviceAggregate[]> {
    return await this.adviceRepository.findAll();
  }

  async deleteAdvice(uid: string) {
    return await this.adviceRepository.delete(uid);
  }
}
