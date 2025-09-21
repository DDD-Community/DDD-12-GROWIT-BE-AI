import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';
import { AdviceGeneratorService } from '../ai/application/services/advice-generator.service';
import { GenerateAdviceUseCase } from './application/use-cases/generate-advice.use-case';
import { AdviceDomainService } from './domain/services/advice.domain.service';
import { AdviceEntity } from './infrastructure/entities/advice.entity';
import { AdviceTypeOrmRepository } from './infrastructure/repositories/advice-typeorm.repository';
import { AdviceController } from './presentation/controllers/advice.controller';

@Module({
  imports: [AiModule, TypeOrmModule.forFeature([AdviceEntity])],
  controllers: [AdviceController],
  providers: [
    GenerateAdviceUseCase,
    AdviceDomainService,
    {
      provide: 'AdviceRepository',
      useClass: AdviceTypeOrmRepository,
    },
    {
      provide: 'AdviceGenerator',
      useClass: AdviceGeneratorService,
    },
  ],
  exports: [GenerateAdviceUseCase, 'AdviceRepository'],
})
export class DailyAdviceModule {}
