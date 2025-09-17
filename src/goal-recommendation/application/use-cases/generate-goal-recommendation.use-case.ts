import { Inject, Injectable, Logger } from '@nestjs/common';
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
  ) {}

  async execute(
    command: GenerateGoalRecommendationCommand,
  ): Promise<GenerateGoalRecommendationResult> {
    this.logger.log(
      `Generating goal recommendation for user ${command.userId} with mentor ${command.mentorType}`,
    );

    try {
      // 도메인 서비스 호출
      const domainResult =
        await this.goalRecommendationDomainService.generateGoalRecommendation({
          userId: command.userId,
          promptId: command.promptId,
          input: {
            mentorType: MentorTypeVO.create(command.mentorType),
            pastTodos: command.pastTodos,
            pastRetrospects: command.pastRetrospects,
            overallGoal: command.overallGoal,
          },
        });

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
}
