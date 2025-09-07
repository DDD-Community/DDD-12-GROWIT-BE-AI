import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiEntity } from './entities/ai.entity';
import { AiRoleEntity } from './entities/ai-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AiEntity,
      AiRoleEntity,
    ]),
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class AiEntityModule {}
