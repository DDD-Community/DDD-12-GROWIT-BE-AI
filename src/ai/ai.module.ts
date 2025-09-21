import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyAdviceScheduler } from '../schedulers/daily-advice.scheduler';
import { CreatePromptTemplateUseCase } from './application/use-cases/create-prompt-template.use-case';
import { PromptTemplateController } from './controllers/prompt-template.controller';
import { AIGeneratorRepository } from './domain/repositories/ai-generator.repository';
import { PromptTemplateEntity } from './infrastructure/entities/prompt-template.entity';
import { OpenAIGeneratorRepository } from './infrastructure/openai-generator.repository';
import { PromptTemplateTypeOrmRepository } from './infrastructure/repositories/prompt-template-typeorm.repository';
import { AdviceGeneratorService } from './services/advice-generator.service';
import { GoalRecommenderService } from './services/goal-recommender.service';
import { OpenAIService } from './services/openai.service';
import { PromptBasedGeneratorService } from './services/prompt-based-generator.service';
import { PromptTemplateService } from './services/prompt-template.service';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([PromptTemplateEntity]),
  ],
  controllers: [PromptTemplateController],
  providers: [
    OpenAIService,
    AdviceGeneratorService,
    GoalRecommenderService,
    PromptBasedGeneratorService,
    {
      provide: AIGeneratorRepository,
      useClass: OpenAIGeneratorRepository,
    },
    {
      provide: 'PromptTemplateRepository',
      useClass: PromptTemplateTypeOrmRepository,
    },
    DailyAdviceScheduler,
    PromptTemplateService,
    CreatePromptTemplateUseCase,
  ],
  exports: [
    AIGeneratorRepository,
    DailyAdviceScheduler,
    PromptTemplateService,
    OpenAIService,
    AdviceGeneratorService,
    GoalRecommenderService,
    PromptBasedGeneratorService,
  ],
})
export class AiModule {}
