import { Inject, Injectable, Logger } from '@nestjs/common';
import { GoalRecommendationAggregate } from '../../domain/goal-recommendation.domain';
import { GoalRecommendationRepository } from '../../domain/repositories/goal-recommendation.repository';
import { GoalRecommendationDomainService } from '../../domain/services/goal-recommendation.domain.service';
import { GoalTemplateDomainService } from '../../domain/services/goal-template.domain.service';
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
    private readonly goalTemplateService: GoalTemplateDomainService,
  ) {}

  async execute(
    command: GenerateGoalRecommendationCommand,
  ): Promise<GenerateGoalRecommendationResult> {
    this.logger.log(
      `Generating goal recommendation for user ${command.userId} with promptId ${command.promptId}`,
    );

    try {
      // 1. Domain Service를 통해 비즈니스 로직 실행
      const domainResult = command.promptId
        ? await this.goalTemplateService.generateWithTemplate(command)
        : await this.goalRecommendationDomainService.generateGoalRecommendation(
            command,
          );

      if (!domainResult.success) {
        this.logger.error(
          `Domain validation failed for user ${command.userId}: ${domainResult.error}`,
        );
        return domainResult;
      }

      // 2. Repository를 통해 영속성 처리
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
