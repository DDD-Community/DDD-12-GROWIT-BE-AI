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
  GoalRecommendationResponseDto,
  ListGoalRecommendationResponseDto,
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
      request.templateUid,
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

  @Get(':uid')
  async getGoalRecommendation(
    @Param('uid') uid: string,
  ): Promise<GoalRecommendationResponseDto> {
    this.logger.log('Getting goal recommendation:', uid);

    const goalRecommendation =
      await this.generateGoalRecommendationUseCase.getGoalRecommendation(uid);
    if (!goalRecommendation) {
      throw new Error(`Goal recommendation with UID ${uid} not found`);
    }

    return {
      id: goalRecommendation.id.toString(),
      uid: goalRecommendation.uid,
      userId: goalRecommendation.userId.getValue(),
      promptId: goalRecommendation.promptId,
      input: {
        mentorType: goalRecommendation.input.mentorType.toString(),
        pastTodos: goalRecommendation.input.pastTodos,
        pastRetrospects: goalRecommendation.input.pastRetrospects,
        overallGoal: goalRecommendation.input.overallGoal,
      },
      output: goalRecommendation.output,
      createdAt: goalRecommendation.createdAt,
      updatedAt: goalRecommendation.updatedAt,
    };
  }

  @Get()
  async listGoalRecommendations(): Promise<ListGoalRecommendationResponseDto> {
    this.logger.log('Listing all goal recommendations');

    const goalRecommendationList =
      await this.generateGoalRecommendationUseCase.listGoalRecommendations();

    const goalRecommendationResponseList = goalRecommendationList.map(
      (goalRecommendation) => ({
        id: goalRecommendation.id.toString(),
        uid: goalRecommendation.uid,
        userId: goalRecommendation.userId.getValue(),
        promptId: goalRecommendation.promptId,
        input: {
          mentorType: goalRecommendation.input.mentorType.toString(),
          pastTodos: goalRecommendation.input.pastTodos,
          pastRetrospects: goalRecommendation.input.pastRetrospects,
          overallGoal: goalRecommendation.input.overallGoal,
        },
        output: goalRecommendation.output,
        createdAt: goalRecommendation.createdAt,
        updatedAt: goalRecommendation.updatedAt,
      }),
    );

    return {
      success: true,
      goalRecommendations: goalRecommendationResponseList,
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
