import { Inject, Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../../ai/application/services/openai.service';
import { PromptTemplateService } from '../../../ai/application/services/prompt-template.service';
import { GoalRecommendationAggregate } from '../../domain/goal-recommendation.domain';
import { GoalRecommendationRepository } from '../../domain/goal-recommendation.repository';
import { GoalRecommendationDomainService } from '../../domain/services/goal-recommendation.domain.service';
import { GenerateGoalRecommendationCommand } from '../commands/generate-goal-recommendation.command';

export interface GenerateGoalRecommendationResult {
  success: boolean;
  entity: GoalRecommendationAggregate | null;
  id?: string;
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
      `Generating goal recommendation for user ${command.userId} with promptId ${command.promptId}`,
    );

    try {
      let domainResult: GenerateGoalRecommendationResult;

      if (command.templateUid) {
        domainResult = await this.generateWithTemplate(command);
      } else {
        domainResult =
          await this.goalRecommendationDomainService.generateGoalRecommendation(
            command,
          );
      }

      if (!domainResult.success) {
        this.logger.error(
          `Domain validation failed for user ${command.userId}: ${domainResult.error}`,
        );
        return domainResult;
      }

      await this.goalRecommendationRepository.save(domainResult.entity);

      this.logger.log(
        `Successfully generated goal recommendation for user ${command.userId} with ID: ${domainResult.entity.uid}`,
      );

      return {
        ...domainResult,
        id: domainResult.entity.uid,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate goal recommendation for user ${command.userId}: ${error.message}`,
      );

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

      const goalRecommendationEntity = GoalRecommendationAggregate.create(
        command.userId,
        command.promptId,
        template.name,
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
      );

      const basePrompt = template.generateFullPrompt();
      const contextualPrompt = this.buildContextualPrompt(
        basePrompt,
        template.name,
        command.pastTodos,
        command.pastRetrospects,
        command.overallGoal,
      );

      const generatedGoal =
        await this.openaiService.generateGoal(contextualPrompt);

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

  async getLatestGoalRecommendationByUserId(
    userId: string,
  ): Promise<GoalRecommendationAggregate | null> {
    return await this.goalRecommendationRepository.findLatestByUserId(userId);
  }

  async listGoalRecommendations(): Promise<GoalRecommendationAggregate[]> {
    return await this.goalRecommendationRepository.findAll();
  }

  async deleteGoalRecommendation(uid: string) {
    return await this.goalRecommendationRepository.delete(uid);
  }
}
