import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiEntity } from '../persistence/entities/ai.entity';
import { AiRoleEntity } from '../persistence/entities/ai-role.entity';

export const AI_REPOSITORY = 'AI_REPOSITORY';
export const AI_ROLE_REPOSITORY = 'AI_ROLE_REPOSITORY';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiEntity, AiRoleEntity]),
  ],
})
export class AiRepositoriesModule {}