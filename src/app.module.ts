import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config
import { appConfig } from './common/config/app.config';
import { databaseConfig } from './common/config/database.config';

// Modules
import { AdviceModule } from './advice/advice.module';
import { AiModule } from './ai/ai.module';
import { AiEntityModule } from './ai/infrastructure/persistence/ai-entitiy.module';
import { GoalModule } from './goal/goal.module';
import { RetrospectModule } from './retrospect/retrospect.module';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    AiEntityModule,
    AiModule,
    AdviceModule,
    GoalModule,
    RetrospectModule,
    TodoModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
