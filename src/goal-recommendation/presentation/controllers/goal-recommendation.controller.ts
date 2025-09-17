import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GenerateGoalRecommendationCommand } from '../../application/commands/generate-goal-recommendation.command';
import { GenerateGoalRecommendationUseCase } from '../../application/use-cases/generate-goal-recommendation.use-case';
import {
  GenerateGoalRecommendationRequestDto,
  GenerateGoalRecommendationResponseDto,
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

    // DTO 검증은 ValidationPipe가 자동으로 처리
    // 비즈니스 로직 검증은 Use Case에서 처리
    const command = new GenerateGoalRecommendationCommand(
      request.userId,
      request.promptId,
      request.input.mentorType,
      request.input.pastTodos,
      request.input.pastRetrospects,
      request.input.overallGoal,
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
      output: result.entity.output,
      generatedAt: result.entity.createdAt,
      error: result.error,
    };
  }
}
