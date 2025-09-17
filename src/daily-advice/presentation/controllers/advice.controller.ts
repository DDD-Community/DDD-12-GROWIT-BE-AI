import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { GenerateAdviceCommand } from '../../application/commands/generate-advice.command';
import { GenerateAdviceUseCase } from '../../application/use-cases/generate-advice.use-case';
import {
  AdviceResponseDto,
  DeleteAdviceResponseDto,
  GenerateAdviceRequestDto,
  GenerateAdviceResponseDto,
  ListAdviceResponseDto,
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
      request.templateUid,
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

  @Get(':uid')
  async getAdvice(@Param('uid') uid: string): Promise<AdviceResponseDto> {
    this.logger.log('Getting advice:', uid);

    const advice = await this.generateAdviceUseCase.getAdvice(uid);
    if (!advice) {
      throw new Error(`Advice with UID ${uid} not found`);
    }

    return {
      id: advice.id.toString(),
      uid: advice.uid,
      userId: advice.userId.getValue(),
      promptId: advice.promptId,
      input: {
        mentorType: advice.input.mentorType.toString(),
        recentTodos: advice.input.recentTodos,
        weeklyRetrospects: advice.input.weeklyRetrospects,
        overallGoal: advice.input.overallGoal,
      },
      output: advice.output,
      createdAt: advice.createdAt,
      updatedAt: advice.updatedAt,
    };
  }

  @Get()
  async listAdvice(): Promise<ListAdviceResponseDto> {
    this.logger.log('Listing all advice');

    const adviceList = await this.generateAdviceUseCase.listAdvice();

    const adviceResponseList = adviceList.map((advice) => ({
      id: advice.id.toString(),
      uid: advice.uid,
      userId: advice.userId.getValue(),
      promptId: advice.promptId,
      input: {
        mentorType: advice.input.mentorType.toString(),
        recentTodos: advice.input.recentTodos,
        weeklyRetrospects: advice.input.weeklyRetrospects,
        overallGoal: advice.input.overallGoal,
      },
      output: advice.output,
      createdAt: advice.createdAt,
      updatedAt: advice.updatedAt,
    }));

    return {
      success: true,
      advice: adviceResponseList,
    };
  }

  @Delete(':uid')
  async deleteAdvice(
    @Param('uid') uid: string,
  ): Promise<DeleteAdviceResponseDto> {
    this.logger.log('Deleting advice:', uid);

    const existingAdvice = await this.generateAdviceUseCase.getAdvice(uid);
    if (!existingAdvice) {
      throw new Error(`Advice with UID ${uid} not found`);
    }

    await this.generateAdviceUseCase.deleteAdvice(uid);

    return {
      success: true,
      message: `Advice for user '${existingAdvice.userId.getValue()}' has been successfully deleted`,
    };
  }
}
