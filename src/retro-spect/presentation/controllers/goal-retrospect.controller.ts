import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GenerateRetrospectAnalysisCommand } from '../../application/commands/generate-retrospect-analysis.command';
import { GenerateRetrospectAnalysisUseCase } from '../../application/use-cases/generate-retrospect-analysis.use-case';
import {
  GenerateRetrospectAnalysisRequestDto,
  GenerateRetrospectAnalysisResponseDto,
} from '../dto/generate-retrospect-analysis.dto';

@Controller('goal-retrospect')
export class GoalRetrospectController {
  private readonly logger = new Logger(GoalRetrospectController.name);

  constructor(
    private readonly generateRetrospectAnalysisUseCase: GenerateRetrospectAnalysisUseCase,
  ) {}

  @Post('analyze')
  async generateRetrospectAnalysis(
    @Body() request: GenerateRetrospectAnalysisRequestDto,
  ): Promise<GenerateRetrospectAnalysisResponseDto> {
    this.logger.log(
      'Received retrospect analysis generation request for goal:',
      request.goalId,
    );

    const command = new GenerateRetrospectAnalysisCommand(
      request.goalId,
      request.content,
      request.goal,
      request.retrospects,
      request.todos,
    );

    const result =
      await this.generateRetrospectAnalysisUseCase.execute(command);

    if (!result.success || !result.analysis) {
      return {
        success: false,
        goalId: request.goalId,
        error: result.error,
      };
    }

    return {
      success: result.success,
      goalId: request.goalId,
      todoCompletedRate: result.todoCompletedRate,
      analysis: {
        summary: result.analysis.summary,
        advice: result.analysis.advice,
      },
    };
  }
}
