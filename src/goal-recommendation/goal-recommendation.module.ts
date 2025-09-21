import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';
import { GoalRecommenderService } from '../ai/application/services/goal-recommender.service';
import { GenerateGoalRecommendationUseCase } from './application/use-cases/generate-goal-recommendation.use-case';
import { GoalRecommendationDomainService } from './domain/services/goal-recommendation.domain.service';
import { GoalRecommendationTypeOrmEntity } from './infrastructure/entities/goal-recommendation.entity';
import { GoalRecommendationTypeOrmRepository } from './infrastructure/repositories/goal-recommendation-typeorm.repository';
import { GoalRecommendationController } from './presentation/controllers/goal-recommendation.controller';

@Module({
  imports: [
    AiModule,
    TypeOrmModule.forFeature([GoalRecommendationTypeOrmEntity]),
  ],
  controllers: [GoalRecommendationController],
  providers: [
    GenerateGoalRecommendationUseCase,
    GoalRecommendationDomainService,
    {
      provide: 'GoalRecommendationRepository',
      useClass: GoalRecommendationTypeOrmRepository,
    },
    {
      provide: 'GoalRecommender',
      useClass: GoalRecommenderService,
    },
  ],
  exports: [GenerateGoalRecommendationUseCase, 'GoalRecommendationRepository'],
})
export class GoalRecommendationModule {}
