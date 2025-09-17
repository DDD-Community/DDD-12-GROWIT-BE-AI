import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpringClientService } from '../external/spring-client.service';
import { DailyAdviceScheduler } from '../schedulers/daily-advice.scheduler';
import { PromptTemplateController } from './controllers/prompt-template.controller';
import { MentorFactory } from './domain/factories/mentor.factory';
import { AIGeneratorRepository } from './domain/repositories/ai-generator.repository';
import { SpringIntegrationRepository } from './domain/repositories/spring-integration.repository';
import { PromptTemplateEntity } from './infrastructure/entities/prompt-template.entity';
import { MockSpringRepository } from './infrastructure/mock-spring.repository';
import { OpenAIGeneratorRepository } from './infrastructure/openai-generator.repository';
import { SpringIntegrationRepositoryImpl } from './infrastructure/spring-integration.repository';
import { AdviceGeneratorService } from './services/advice-generator.service';
import { GoalRecommenderService } from './services/goal-recommender.service';
import { OpenAIService } from './services/openai.service';
import { PromptTemplateService } from './services/prompt-template.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([PromptTemplateEntity]),
  ],
  controllers: [PromptTemplateController],
  providers: [
    MentorFactory,
    OpenAIService,
    AdviceGeneratorService,
    GoalRecommenderService,
    {
      provide: AIGeneratorRepository,
      useClass: OpenAIGeneratorRepository,
    },
    {
      provide: SpringIntegrationRepository,
      useFactory: (httpService, configService) => {
        const isTestMode =
          process.env.NODE_ENV === 'test' ||
          process.env.USE_MOCK_SPRING === 'true';
        return isTestMode
          ? new MockSpringRepository()
          : new SpringIntegrationRepositoryImpl(httpService, configService);
      },
      inject: [HttpService, ConfigService],
    },
    SpringClientService,
    DailyAdviceScheduler,
    PromptTemplateService,
  ],
  exports: [
    AIGeneratorRepository,
    SpringIntegrationRepository,
    DailyAdviceScheduler,
    PromptTemplateService,
    OpenAIService,
    AdviceGeneratorService,
    GoalRecommenderService,
  ],
})
export class AiModule {}
