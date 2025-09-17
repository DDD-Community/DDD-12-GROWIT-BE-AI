import { GoalRecommendationAggregate } from '../goal-recommendation.domain';

export interface GoalRecommendationRepository {
  save(entity: GoalRecommendationAggregate): Promise<void>;
  findById(id: string): Promise<GoalRecommendationAggregate | null>;
  findByUserId(userId: string): Promise<GoalRecommendationAggregate[]>;
  findByPromptId(promptId: string): Promise<GoalRecommendationAggregate[]>;
  findAll(
    limit?: number,
    offset?: number,
  ): Promise<GoalRecommendationAggregate[]>;
  delete(id: string): Promise<void>;
}
