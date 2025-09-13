import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './infrastructure/persistence/entities/todo.entity';
import { TodoRepository } from './infrastructure/persistence/todo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoRepository],
  exports: [TodoRepository],
})
export class TodoModule {}
