import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../../ai/services/openai.service';
import { PromptTemplateService } from '../../../ai/services/prompt-template.service';
import { GoalRecommendationAggregate } from '../../domain/goal-recommendation.domain';
import { GoalRecommendationRepository } from '../../domain/goal-recommendation.repository';
import { GoalRecommendationDomainService } from '../../domain/services/goal-recommendation.domain.service';
import { MentorTypeVO } from '../../domain/value-objects';
import { GenerateGoalRecommendationCommand } from '../commands/generate-goal-recommendation.command';

export interface GenerateGoalRecommendationResult {
  success: boolean;
  entity: GoalRecommendationAggregate | null;
  error?: string;
}

@Injectable()
export class GenerateGoalRecommendationUseCase {
  private readonly logger = new Logger(GenerateGoalRecommendationUseCase.name);

  constructor(
    @Inject('GoalRecommendationRepository')
    private readonly goalRecommendationRepository: GoalRecommendationRepository,
    private readonly goalRecommendationDomainService: GoalRecommendationDomainService,
    private readonly promptTemplateService: PromptTemplateService,
    private readonly openaiService: OpenAIService,
  ) {}

  async execute(
    command: GenerateGoalRecommendationCommand,
  ): Promise<GenerateGoalRecommendationResult> {
    this.logger.log(
      `Generating goal recommendation for user ${command.userId} with mentor ${command.mentorType}`,
    );

    try {
      let domainResult: GenerateGoalRecommendationResult;

      // 템플릿이 제공된 경우 템플릿 기반 생성
      if (command.templateUid) {
        domainResult = await this.generateWithTemplate(command);
      } else {
        // 기존 도메인 서비스 호출
        domainResult =
          await this.goalRecommendationDomainService.generateGoalRecommendation(
            {
              userId: command.userId,
              promptId: command.promptId,
              input: {
                mentorType: MentorTypeVO.create(command.mentorType),
                pastTodos: command.pastTodos,
                pastRetrospects: command.pastRetrospects,
                overallGoal: command.overallGoal,
              },
            },
          );
      }

      if (!domainResult.success) {
        this.logger.error(
          `Domain validation failed for user ${command.userId}: ${domainResult.error}`,
        );
        return domainResult;
      }

      // 엔티티 저장
      await this.goalRecommendationRepository.save(domainResult.entity);

      this.logger.log(
        `Successfully generated goal recommendation for user ${command.userId}`,
      );

      return domainResult;
    } catch (error) {
      this.logger.error(
        `Failed to generate goal recommendation for user ${command.userId}: ${error.message}`,
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
    command: GenerateGoalRecommendationCommand,
  ): Promise<GenerateGoalRecommendationResult> {
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

      // 2. 목표 추천 엔티티 생성
      const goalRecommendationEntity = GoalRecommendationAggregate.create(
        command.userId,
        command.promptId,
        command.mentorType,
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
      );

      // 3. 템플릿을 기반으로 프롬프트 생성
      const basePrompt = template.generateFullPrompt();
      const contextualPrompt = this.buildContextualPrompt(
        basePrompt,
        command.mentorType,
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
      );

      // 4. OpenAI API 호출
      const generatedGoal =
        await this.openaiService.generateGoal(contextualPrompt);

      // 5. 엔티티에 결과 업데이트
      goalRecommendationEntity.updateOutput(generatedGoal);

      return {
        success: true,
        entity: goalRecommendationEntity,
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
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): string {
    const context = `
사용자 정보:
- 멘토 타입: ${mentorType}
- 과거 할 일: ${pastTodos.join(', ')}
- 과거 회고: ${pastRetrospects.join(', ')}
- 전체 목표: ${overallGoal}

${basePrompt}

위 정보를 바탕으로 ${mentorType} 멘토의 관점에서 목표를 추천해주세요.
`;

    return context;
  }

  async getGoalRecommendation(
    uid: string,
  ): Promise<GoalRecommendationAggregate | null> {
    return await this.goalRecommendationRepository.findById(uid);
  }

  async listGoalRecommendations(): Promise<GoalRecommendationAggregate[]> {
    return await this.goalRecommendationRepository.findAll();
  }

  async deleteGoalRecommendation(uid: string) {
    return await this.goalRecommendationRepository.delete(uid);
  }
}
