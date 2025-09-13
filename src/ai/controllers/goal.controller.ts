import { Body, Controller, Logger, Post } from '@nestjs/common';
import { RecommendGoalRequestDto, RecommendGoalResponseDto } from '../dto';
import { GoalRecommenderService } from '../services/goal-recommender.service';

@Controller('ai')
export class GoalController {
  private readonly logger = new Logger(GoalController.name);

  constructor(
    private readonly goalRecommenderService: GoalRecommenderService,
  ) {}

  @Post('recommend-goal')
  async recommendGoal(
    @Body() request: RecommendGoalRequestDto,
  ): Promise<RecommendGoalResponseDto> {
    try {
      this.logger.log(
        `Recommending goal for user ${request.userId} with mentor ${request.mentorType}`,
      );

      const weeklyGoal = await this.goalRecommenderService.recommendGoal(
        request.mentorType,
        request.pastTodos,
        request.pastRetrospects,
        request.overallGoal,
        request.intimacyLevel,
      );

      return {
        success: true,
        weeklyGoal,
        mentorType: request.mentorType,
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to recommend goal for user ${request.userId}:`,
        error.message,
      );

      const fallbackGoal = await this.goalRecommenderService.recommendGoal(
        request.mentorType,
        [],
        [],
        '기본 목표',
        request.intimacyLevel,
      );

      return {
        success: false,
        weeklyGoal: fallbackGoal,
        mentorType: request.mentorType,
        generatedAt: new Date(),
        error: error.message,
      };
    }
  }
}
