import { Controller, Post, UseGuards } from '@nestjs/common';
import { User, UserPayload } from '../../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreateAiUseCase } from '../../application/use-cases/create-ai.usecase';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly createAiUseCase: CreateAiUseCase) {}

  @Post()
  async createAi(@User() user: UserPayload) {
    return await this.createAiUseCase.execute(user.id);
  }
}
