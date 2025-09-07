import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateAiUseCase } from '../../application/use-cases/create-ai.usecase';
import { User, UserPayload } from '../../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly createAiUseCase: CreateAiUseCase) {}

  @Post()
  async createAi(@User() user: UserPayload) {
    return await this.createAiUseCase.execute(user.id);
  }
}
