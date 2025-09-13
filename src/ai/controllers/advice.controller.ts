import { Body, Controller, Logger, Post } from '@nestjs/common';
import {
  BatchAdviceResult,
  BatchGenerateAdviceRequestDto,
  BatchGenerateAdviceResponseDto,
  GenerateAdviceRequestDto,
  GenerateAdviceResponseDto,
} from '../dto';
import { AdviceGeneratorService } from '../services/advice-generator.service';

@Controller('ai')
export class AdviceController {
  private readonly logger = new Logger(AdviceController.name);

  constructor(
    private readonly adviceGeneratorService: AdviceGeneratorService,
  ) {}

  @Post('generate-advice')
  async generateAdvice(
    @Body() request: GenerateAdviceRequestDto,
  ): Promise<GenerateAdviceResponseDto> {
    try {
      this.logger.log(
        `Generating advice for user ${request.userId} with mentor ${request.mentorType}`,
      );

      const advice = await this.adviceGeneratorService.generateAdvice(
        request.mentorType,
        request.recentTodos,
        request.weeklyRetrospects,
        request.intimacyLevel,
      );

      return {
        success: true,
        advice,
        mentorType: request.mentorType,
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for user ${request.userId}:`,
        error.message,
      );

      const fallbackAdvice = await this.adviceGeneratorService.generateAdvice(
        request.mentorType,
        [],
        [],
        request.intimacyLevel,
      );

      return {
        success: false,
        advice: fallbackAdvice,
        mentorType: request.mentorType,
        generatedAt: new Date(),
        error: error.message,
      };
    }
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
      try {
        const advice = await this.adviceGeneratorService.generateAdvice(
          adviceRequest.mentorType,
          adviceRequest.recentTodos,
          adviceRequest.weeklyRetrospects,
          adviceRequest.intimacyLevel,
        );

        results.push({
          userId: adviceRequest.userId,
          success: true,
          advice,
        });

        successfulRequests++;
      } catch (error) {
        const errorMessage = `Failed to generate advice for user ${adviceRequest.userId}: ${error.message}`;
        this.logger.error(errorMessage);

        results.push({
          userId: adviceRequest.userId,
          success: false,
          error: error.message,
        });

        errors.push(errorMessage);
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
