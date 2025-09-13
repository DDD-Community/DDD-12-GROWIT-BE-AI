import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AdviceController } from './controllers/advice.controller';
import { GoalController } from './controllers/goal.controller';

import { OpenAIService } from './services/openai.service';
import { PromptTemplateService } from './services/prompt-template.service';
import { AdviceGeneratorService } from './services/advice-generator.service';
import { GoalRecommenderService } from './services/goal-recommender.service';

import { SpringClientService } from '../external/spring-client.service';
import { DailyAdviceScheduler } from '../schedulers/daily-advice.scheduler';

/**
 * AI Module for MSA Architecture
 * MSA 구조에 맞는 AI 서비스 모듈
 */
@Module({
  imports: [ConfigModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [AdviceController, GoalController],
  providers: [
    OpenAIService,
    PromptTemplateService,
    AdviceGeneratorService,
    GoalRecommenderService,
    SpringClientService,
    DailyAdviceScheduler,
  ],
  exports: [
    AdviceGeneratorService,
    GoalRecommenderService,
    SpringClientService,
    DailyAdviceScheduler,
  ],
})
export class AiModule {}
