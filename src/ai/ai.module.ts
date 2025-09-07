import { Module } from '@nestjs/common';
import { AiController } from './presentation/controllers/ai.controller';
import { AiEntityModule } from './infrastructure/persistence/ai-entitiy.module';
import { OpenAiService } from './application/services/openai.service';
import { CreateAiUseCase } from './application/use-cases/create-ai.usecase';

@Module({
  imports: [AiEntityModule],
  controllers: [AiController],
  providers: [CreateAiUseCase, OpenAiService],
  exports: [CreateAiUseCase],
})
export class AiModule {}
