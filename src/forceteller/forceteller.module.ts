import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForcetellerService } from './application/services/forceteller.service';
import { ForcetellerApiClient } from './infrastructure/forceteller-api.client';
import { ForcetellerController } from './presentation/controllers/forceteller.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ForcetellerController],
  providers: [ForcetellerApiClient, ForcetellerService],
  exports: [ForcetellerService],
})
export class ForcetellerModule {}
