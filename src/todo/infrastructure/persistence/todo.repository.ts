import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoInterface } from '../../domain/todo.interface';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findByUserId(userId: string): Promise<TodoInterface[]> {
    const todos = await this.todoRepository.find({
      where: {
        userId,
        isDeleted: false,
      },
      order: { createdAt: 'DESC' },
    });

    return todos.map((todo) => this.mapToTodoInterface(todo));
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.todoRepository.count({
      where: { userId, isDeleted: false },
    });
  }

  async countCompletedByUserId(userId: string): Promise<number> {
    return await this.todoRepository.count({
      where: { userId, isCompleted: true, isDeleted: false },
    });
  }

  private mapToTodoInterface(todo: Todo): TodoInterface {
    return {
      id: todo.uid,
      userId: todo.userId,
      planId: todo.planId,
      goalId: todo.goalId,
      date: todo.date,
      content: todo.content,
      isCompleted: todo.isCompleted,
      isDeleted: todo.isDeleted,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      deletedAt: todo.deletedAt,
    };
  }
}
