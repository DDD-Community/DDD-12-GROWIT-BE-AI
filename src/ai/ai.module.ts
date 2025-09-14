import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AdviceController } from './controllers/advice.controller';
import { GoalController } from './controllers/goal.controller';
import { IntimacyController } from './controllers/intimacy.controller';

import { OpenAIService } from './services/openai.service';
import { PromptTemplateService } from './services/prompt-template.service';
import { AdviceGeneratorService } from './services/advice-generator.service';
import { GoalRecommenderService } from './services/goal-recommender.service';
import { IntimacyCalculatorService } from './services/intimacy-calculator.service';

import { SpringClientService } from '../external/spring-client.service';
import { DailyAdviceScheduler } from '../schedulers/daily-advice.scheduler';

/**
 * AI Module for MSA Architecture
 * MSA 구조에 맞는 AI 서비스 모듈
 */
@Module({
  imports: [ConfigModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [AdviceController, GoalController, IntimacyController],
  providers: [
    OpenAIService,
    PromptTemplateService,
    AdviceGeneratorService,
    GoalRecommenderService,
    IntimacyCalculatorService,
    SpringClientService,
    DailyAdviceScheduler,
  ],
  exports: [
    AdviceGeneratorService,
    GoalRecommenderService,
    IntimacyCalculatorService,
    SpringClientService,
    DailyAdviceScheduler,
  ],
})
export class AiModule {}
