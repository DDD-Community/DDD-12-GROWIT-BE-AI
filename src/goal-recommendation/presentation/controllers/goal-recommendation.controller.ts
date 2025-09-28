import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { GenerateGoalRecommendationCommand } from '../../application/commands/generate-goal-recommendation.command';
import { GenerateGoalRecommendationUseCase } from '../../application/use-cases/generate-goal-recommendation.use-case';
import {
  DeleteGoalRecommendationResponseDto,
  GenerateGoalRecommendationRequestDto,
  GenerateGoalRecommendationResponseDto,
  GoalRecommendationSummaryDto,
} from '../dto/generate-goal-recommendation.dto';

@Controller('goal-recommendation')
export class GoalRecommendationController {
  private readonly logger = new Logger(GoalRecommendationController.name);

  constructor(
    private readonly generateGoalRecommendationUseCase: GenerateGoalRecommendationUseCase,
  ) {}

  @Post()
  async generateGoalRecommendation(
    @Body() request: GenerateGoalRecommendationRequestDto,
  ): Promise<GenerateGoalRecommendationResponseDto> {
    this.logger.log(
      'Received goal recommendation request:',
      JSON.stringify(request, null, 2),
    );

    const command = new GenerateGoalRecommendationCommand(
      request.userId,
      request.promptId,
      request.input.pastTodos,
      request.input.pastRetrospects,
      request.input.overallGoal,
      request.input.completedTodos,
      request.input.pastWeeklyGoals,
      request.input.remainingTime,
    );

    const result =
      await this.generateGoalRecommendationUseCase.execute(command);

    if (!result.success || !result.entity) {
      return {
        success: false,
        userId: request.userId,
        promptId: request.promptId,
        output: null,
        generatedAt: null,
        error: result.error,
      };
    }

    return {
      success: result.success,
      userId: request.userId,
      promptId: request.promptId,
      id: result.id,
      output: result.entity.output,
      generatedAt: result.entity.createdAt,
      error: result.error,
    };
  }

  @Get(':userId')
  async getLatestGoalRecommendationByUserId(
    @Param('userId') userId: string,
  ): Promise<GoalRecommendationSummaryDto> {
    this.logger.log('Getting latest goal recommendation for user:', userId);

    const goalRecommendation =
      await this.generateGoalRecommendationUseCase.getLatestGoalRecommendationByUserId(
        userId,
      );
    if (!goalRecommendation) {
      throw new Error(`No goal recommendation found for user ${userId}`);
    }

    return {
      id: goalRecommendation.id.toString(),
      uid: goalRecommendation.uid,
      promptId: goalRecommendation.promptId,
      output: goalRecommendation.output,
      createdAt: goalRecommendation.createdAt,
      updatedAt: goalRecommendation.updatedAt,
    };
  }

  @Delete(':uid')
  async deleteGoalRecommendation(
    @Param('uid') uid: string,
  ): Promise<DeleteGoalRecommendationResponseDto> {
    this.logger.log('Deleting goal recommendation:', uid);

    const existingGoalRecommendation =
      await this.generateGoalRecommendationUseCase.getGoalRecommendation(uid);
    if (!existingGoalRecommendation) {
      throw new Error(`Goal recommendation with UID ${uid} not found`);
    }

    await this.generateGoalRecommendationUseCase.deleteGoalRecommendation(uid);

    return {
      success: true,
      message: `Goal recommendation for user '${existingGoalRecommendation.userId.getValue()}' has been successfully deleted`,
    };
  }
}
