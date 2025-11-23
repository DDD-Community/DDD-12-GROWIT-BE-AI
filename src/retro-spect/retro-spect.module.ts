import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { RetrospectAnalyzerService } from './application/services/retrospect-analyzer.service';
import { GenerateRetrospectAnalysisUseCase } from './application/use-cases/generate-retrospect-analysis.use-case';
import { GoalRetrospectDomainService } from './domain/services/goal-retrospect.domain.service';
import { GoalRetrospectController } from './presentation/controllers/goal-retrospect.controller';

@Module({
  imports: [AiModule],
  controllers: [GoalRetrospectController],
  providers: [
    // Services
    {
      provide: 'RetrospectAnalyzer',
      useClass: RetrospectAnalyzerService,
    },
    RetrospectAnalyzerService,
    GoalRetrospectDomainService,
    // Use Cases
    GenerateRetrospectAnalysisUseCase,
  ],
  exports: [GenerateRetrospectAnalysisUseCase],
})
export class RetroSpectModule {}
