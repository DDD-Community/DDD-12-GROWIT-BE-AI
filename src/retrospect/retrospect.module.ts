import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetrospectApplicationService } from './application/services/retrospect-application.service';
import {
  GoalRetrospect,
  Retrospect,
} from './infrastructure/persistence/entities/retrospect.entity';
import { RetrospectRepository } from './infrastructure/persistence/retrospect.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Retrospect, GoalRetrospect])],
  providers: [RetrospectApplicationService, RetrospectRepository],
  exports: [RetrospectApplicationService, RetrospectRepository],
})
export class RetrospectModule {}
