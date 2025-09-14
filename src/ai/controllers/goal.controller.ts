import { Body, Controller, Logger, Post } from '@nestjs/common';
import { RecommendGoalRequestDto, RecommendGoalResponseDto } from '../dto';
import {
  RecommendGoalUseCase,
  RecommendGoalUseCaseCommand,
} from '../application/use-cases/recommend-goal.use-case';

@Controller('ai')
export class GoalController {
  private readonly logger = new Logger(GoalController.name);

  constructor(private readonly recommendGoalUseCase: RecommendGoalUseCase) {}

  @Post('recommend-goal')
  async recommendGoal(
    @Body() request: RecommendGoalRequestDto,
  ): Promise<RecommendGoalResponseDto> {
    const command: RecommendGoalUseCaseCommand = {
      mentorType: request.mentorType,
      userId: request.userId,
      pastTodos: request.pastTodos,
      pastRetrospects: request.pastRetrospects,
      overallGoal: request.overallGoal,
      intimacyLevel: request.intimacyLevel,
    };

    const result = await this.recommendGoalUseCase.execute(command);

    return {
      success: result.success,
      weeklyGoal: result.weeklyGoal,
      mentorType: result.mentorType,
      generatedAt: result.generatedAt,
      error: result.error,
    };
  }
}
