import { Module } from '@nestjs/common';
import { AiService } from './application/use-cases/ai.service';
import { AiController } from './presentation/controllers/ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
