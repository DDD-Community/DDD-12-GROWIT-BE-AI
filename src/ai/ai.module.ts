import { Module } from '@nestjs/common';
import { AiService } from './application/use-cases/ai.service';
import { AiController } from './presentation/controllers/ai.controller';
import { AiRepositoriesModule } from './infrastructure/repositories/repositories.module';

@Module({
  imports: [AiRepositoriesModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
