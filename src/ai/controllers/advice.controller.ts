import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  BatchAdviceResult,
  BatchGenerateAdviceRequestDto,
  BatchGenerateAdviceResponseDto,
  GenerateAdviceRequestDto,
  GenerateAdviceResponseDto,
} from '../dto';
import {
  GenerateAdviceUseCase,
  GenerateAdviceUseCaseCommand,
} from '../application/use-cases/generate-advice.use-case';

@Controller('ai')
export class AdviceController {
  private readonly logger = new Logger(AdviceController.name);

  constructor(private readonly generateAdviceUseCase: GenerateAdviceUseCase) {}

  @Post('generate-advice')
  async generateAdvice(
    @Body() request: GenerateAdviceRequestDto,
  ): Promise<GenerateAdviceResponseDto> {
    const command: GenerateAdviceUseCaseCommand = {
      mentorType: request.mentorType,
      userId: request.userId,
      recentTodos: request.recentTodos,
      weeklyRetrospects: request.weeklyRetrospects,
      overallGoal: request.overallGoal,
      intimacyLevel: request.intimacyLevel,
    };

    const result = await this.generateAdviceUseCase.execute(command);

    return {
      success: result.success,
      advice: result.advice,
      mentorType: result.mentorType,
      generatedAt: result.generatedAt,
      error: result.error,
    };
  }

  @Post('batch-generate-advice')
  async batchGenerateAdvice(
    @Body() request: BatchGenerateAdviceRequestDto,
  ): Promise<BatchGenerateAdviceResponseDto> {
    this.logger.log(
      `Processing batch advice generation for ${request.requests.length} users`,
    );

    const results: BatchAdviceResult[] = [];
    let successfulRequests = 0;
    const errors: string[] = [];

    for (const adviceRequest of request.requests) {
      const command: GenerateAdviceUseCaseCommand = {
        mentorType: adviceRequest.mentorType,
        userId: adviceRequest.userId,
        recentTodos: adviceRequest.recentTodos,
        weeklyRetrospects: adviceRequest.weeklyRetrospects,
        overallGoal: adviceRequest.overallGoal,
        intimacyLevel: adviceRequest.intimacyLevel,
      };

      const result = await this.generateAdviceUseCase.execute(command);

      results.push({
        userId: adviceRequest.userId,
        success: result.success,
        advice: result.advice,
        error: result.error,
      });

      if (result.success) {
        successfulRequests++;
      } else {
        errors.push(`User ${adviceRequest.userId}: ${result.error}`);
      }
    }

    return {
      success: successfulRequests > 0,
      totalRequests: request.requests.length,
      successfulRequests,
      results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
