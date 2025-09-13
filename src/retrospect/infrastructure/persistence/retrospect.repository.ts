import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  GoalRetrospectInterface,
  RetrospectInterface,
  RetrospectWeeklyInterface,
} from '../../domain/retrospect.interface';
import { GoalRetrospect, Retrospect } from './entities/retrospect.entity';

@Injectable()
export class RetrospectRepository {
  constructor(
    @InjectRepository(Retrospect)
    private readonly retrospectRepository: Repository<Retrospect>,
    @InjectRepository(GoalRetrospect)
    private readonly goalRetrospectRepository: Repository<GoalRetrospect>,
  ) {}

  async findById(id: string): Promise<RetrospectInterface | null> {
    const retrospect = await this.retrospectRepository.findOne({
      where: { uid: id, isDeleted: false },
    });

    if (!retrospect) return null;

    return this.mapToRetrospectInterface(retrospect);
  }

  async findByUserId(userId: string): Promise<RetrospectInterface[]> {
    const retrospects = await this.retrospectRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });

    return retrospects.map((retrospect) =>
      this.mapToRetrospectInterface(retrospect),
    );
  }

  async findByGoalId(goalId: string): Promise<RetrospectInterface[]> {
    const retrospects = await this.retrospectRepository.find({
      where: { goalId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });

    return retrospects.map((retrospect) =>
      this.mapToRetrospectInterface(retrospect),
    );
  }

  async findWeeklyRetrospect(
    userId: string,
    weekStartDate: string,
  ): Promise<RetrospectWeeklyInterface | null> {
    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    // const [goalRetrospects] = await Promise.all([
    //   this.retrospectRepository.find({
    //     where: {
    //       userId,
    //       isDeleted: false,
    //       createdAt: Between(startDate, endDate),
    //     },
    //     order: { createdAt: 'ASC' },
    //   }),
    //   this.goalRetrospectRepository.find({
    //     where: {
    //       isDeleted: false,
    //       createdAt: Between(startDate, endDate),
    //     },
    //     order: { createdAt: 'ASC' },
    //   }),
    // ]);

    const goalRetrospectsFromGoalRepo =
      await this.goalRetrospectRepository.find({
        where: {
          isDeleted: false,
          createdAt: Between(startDate, endDate),
        },
        order: { createdAt: 'ASC' },
      });

    const goalRetrospectInterfaces = goalRetrospectsFromGoalRepo.map((gr) =>
      this.mapToGoalRetrospectInterface(gr),
    );

    const totalGoals = goalRetrospectInterfaces.length;
    const completedGoals = goalRetrospectInterfaces.filter(
      (gr) => gr.todoCompletedRate >= 100,
    ).length;
    const averageCompletionRate =
      totalGoals > 0
        ? goalRetrospectInterfaces.reduce(
            (sum, gr) => sum + gr.todoCompletedRate,
            0,
          ) / totalGoals
        : 0;

    // TODO: 실제 Todo 데이터와 연동하여 계산
    const totalTodos = 0;
    const completedTodos = 0;

    return {
      userId,
      weekStartDate,
      weekEndDate: endDate.toISOString().split('T')[0],
      totalTodos,
      completedTodos,
      totalGoals,
      completedGoals,
      averageCompletionRate,
    };
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.retrospectRepository.count({
      where: { userId, isDeleted: false },
    });
  }

  async countCompletedByUserId(userId: string): Promise<number> {
    return await this.retrospectRepository.count({
      where: { userId, isCompleted: true, isDeleted: false },
    });
  }

  async countByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.retrospectRepository.count({
      where: {
        userId,
        isDeleted: false,
        createdAt: Between(startDate, endDate),
      },
    });
  }

  private mapToRetrospectInterface(
    retrospect: Retrospect,
  ): RetrospectInterface {
    return {
      id: retrospect.uid,
      userId: retrospect.userId,
      goalId: retrospect.goalId,
      planId: retrospect.planId,
      content: retrospect.content,
      isCompleted: retrospect.isCompleted,
      isDeleted: retrospect.isDeleted,
      createdAt: retrospect.createdAt,
      updatedAt: retrospect.updatedAt,
      deletedAt: retrospect.deletedAt,
    };
  }

  private mapToGoalRetrospectInterface(
    goalRetrospect: GoalRetrospect,
  ): GoalRetrospectInterface {
    return {
      id: goalRetrospect.uid,
      goalId: goalRetrospect.goalId,
      todoCompletedRate: goalRetrospect.todoCompletedRate,
      analysisSummary: goalRetrospect.analysisSummary,
      analysisAdvice: goalRetrospect.analysisAdvice,
      content: goalRetrospect.content,
      isDeleted: goalRetrospect.isDeleted,
      createdAt: goalRetrospect.createdAt,
      updatedAt: goalRetrospect.updatedAt,
      deletedAt: goalRetrospect.deletedAt,
    };
  }
}
