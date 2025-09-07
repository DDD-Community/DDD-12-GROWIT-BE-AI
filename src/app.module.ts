import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Config
import { databaseConfig } from './common/config/database.config';
import { appConfig } from './common/config/app.config';

// Modules
import { AiModule } from './ai/ai.module';
import { AiEntityModule } from './ai/infrastructure/persistence/ai-entitiy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [
        '.env',
      ],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    AiEntityModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}