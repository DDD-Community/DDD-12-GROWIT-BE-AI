import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DailyAdviceScheduler } from '../schedulers/daily-advice.scheduler';
import { AdviceGeneratorService } from './application/services/advice-generator.service';
import { GoalRecommenderService } from './application/services/goal-recommender.service';
import { OpenAIService } from './application/services/openai.service';
import { PromptBasedGeneratorService } from './application/services/prompt-based-generator.service';
import { PromptTemplateService } from './application/services/prompt-template.service';
import { TemplateBasedGeneratorService } from './application/services/template-based-generator.service';
import { CreatePromptTemplateUseCase } from './application/use-cases/create-prompt-template.use-case';
import { PromptTemplateController } from './controllers/prompt-template.controller';
import { AIGeneratorRepository } from './domain/repositories/ai-generator.repository';
import { PromptTemplateDomainServiceImpl } from './domain/services/prompt-template.domain.service';
import { PromptTemplateEntity } from './infrastructure/entities/prompt-template.entity';
import { OpenAIGeneratorRepository } from './infrastructure/openai-generator.repository';
import { PromptTemplateTypeOrmRepository } from './infrastructure/repositories/prompt-template-typeorm.repository';

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
    TemplateBasedGeneratorService,
    {
      provide: AIGeneratorRepository,
      useClass: OpenAIGeneratorRepository,
    },
    {
      provide: 'PromptTemplateRepository',
      useClass: PromptTemplateTypeOrmRepository,
    },
    {
      provide: 'PromptInfoService',
      useClass: PromptTemplateService,
    },
    {
      provide: 'PromptTemplateDomainService',
      useClass: PromptTemplateDomainServiceImpl,
    },
    DailyAdviceScheduler,
    PromptTemplateService,
    CreatePromptTemplateUseCase,
  ],
  exports: [
    AIGeneratorRepository,
    DailyAdviceScheduler,
    PromptTemplateService,
    'PromptInfoService',
    OpenAIService,
    AdviceGeneratorService,
    GoalRecommenderService,
    PromptBasedGeneratorService,
    TemplateBasedGeneratorService,
  ],
})
export class AiModule {}
