import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module';
import { ChatAdviceModule } from './chat-advice/chat-advice.module';
import { validate } from './config/env.validation';
import { DailyAdviceModule } from './daily-advice/daily-advice.module';
import { GoalRecommendationModule } from './goal-recommendation/goal-recommendation.module';
import { HealthModule } from './health/health.module';
import { RetroSpectModule } from './retro-spect/retro-spect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'growit_ai'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl:
          configService.get('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    AiModule,
    ChatAdviceModule,
    GoalRecommendationModule,
    DailyAdviceModule,
    RetroSpectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
