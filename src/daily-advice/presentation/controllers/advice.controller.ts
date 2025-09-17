import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GenerateAdviceCommand } from '../../application/commands/generate-advice.command';
import { GenerateAdviceUseCase } from '../../application/use-cases/generate-advice.use-case';
import {
  GenerateAdviceRequestDto,
  GenerateAdviceResponseDto,
} from '../dto/generate-advice.dto';

@Controller('daily-advice')
export class AdviceController {
  private readonly logger = new Logger(AdviceController.name);

  constructor(private readonly generateAdviceUseCase: GenerateAdviceUseCase) {}

  @Post()
  async generateAdvice(
    @Body() request: GenerateAdviceRequestDto,
  ): Promise<GenerateAdviceResponseDto> {
    this.logger.log(
      'Received advice generation request:',
      JSON.stringify(request, null, 2),
    );

    const command = new GenerateAdviceCommand(
      request.userId,
      request.promptId,
      request.input.mentorType,
      request.input.recentTodos,
      request.input.weeklyRetrospects,
      request.input.overallGoal,
    );

    const result = await this.generateAdviceUseCase.execute(command);

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
