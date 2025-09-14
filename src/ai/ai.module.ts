import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AdviceController } from './controllers/advice.controller';
import { GoalController } from './controllers/goal.controller';
import { TestController } from './controllers/test.controller';
import { GenerateAdviceUseCase } from './application/use-cases/generate-advice.use-case';
import { RecommendGoalUseCase } from './application/use-cases/recommend-goal.use-case';
import { BatchAdviceUseCase } from './application/use-cases/batch-advice.use-case';
import { AdviceDomainService } from './domain/services/advice-domain.service';
import { GoalDomainService } from './domain/services/goal-domain.service';
import { MentorFactory } from './domain/factories/mentor.factory';
import { AIGeneratorRepository } from './domain/repositories/ai-generator.repository';
import { SpringIntegrationRepository } from './domain/repositories/spring-integration.repository';
import { OpenAIGeneratorRepository } from './infrastructure/openai-generator.repository';
import { SpringIntegrationRepositoryImpl } from './infrastructure/spring-integration.repository';
import { MockSpringRepository } from './infrastructure/mock-spring.repository';
import { SpringClientService } from '../external/spring-client.service';
import { DailyAdviceScheduler } from '../schedulers/daily-advice.scheduler';
@Module({
  imports: [ConfigModule, HttpModule, ScheduleModule.forRoot()],
  controllers: [AdviceController, GoalController, TestController],
  providers: [
    GenerateAdviceUseCase,
    RecommendGoalUseCase,
    BatchAdviceUseCase,
    AdviceDomainService,
    GoalDomainService,
    MentorFactory,
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
  ],
  exports: [
    GenerateAdviceUseCase,
    RecommendGoalUseCase,
    BatchAdviceUseCase,
    SpringIntegrationRepository,
    DailyAdviceScheduler,
  ],
})
export class AiModule {}
