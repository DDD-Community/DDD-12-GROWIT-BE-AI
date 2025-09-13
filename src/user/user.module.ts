import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetrospectModule } from '../retrospect/retrospect.module';
import { TodoModule } from '../todo/todo.module';
import { UserProfileService } from './domain/services/user-profile.service';
import { User } from './infrastructure/persistence/entities/user.entity';
import { UserRepository } from './infrastructure/persistence/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TodoModule, RetrospectModule],
  providers: [UserRepository, UserProfileService],
  exports: [UserRepository, UserProfileService],
})
export class UserModule {}
