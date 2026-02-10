import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ForcetellerService } from './application/services/forceteller.service';
import { ForcetellerController } from './presentation/controllers/forceteller.controller';

@Module({
  imports: [HttpModule],
  controllers: [ForcetellerController],
  providers: [ForcetellerService],
  exports: [ForcetellerService],
})
export class ForcetellerModule {}
