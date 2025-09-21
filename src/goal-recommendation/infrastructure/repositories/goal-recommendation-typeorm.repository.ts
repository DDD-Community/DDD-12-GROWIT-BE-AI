import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalRecommendationAggregate } from '../../domain/goal-recommendation.domain';
import { GoalRecommendationRepository } from '../../domain/goal-recommendation.repository';
import { GoalRecommendationTypeOrmEntity } from '../entities/goal-recommendation.entity';

@Injectable()
export class GoalRecommendationTypeOrmRepository
  implements GoalRecommendationRepository
{
  constructor(
    @InjectRepository(GoalRecommendationTypeOrmEntity)
    private readonly repository: Repository<GoalRecommendationTypeOrmEntity>,
  ) {}

  async save(entity: GoalRecommendationAggregate): Promise<void> {
    const props = entity.toPersistence();

    const typeOrmEntity = this.repository.create({
      id: props.id,
      uid: props.uid,
      userId: props.userId.getValue(),
      promptId: props.promptId,
      mentorType: props.input.mentorType.toString(),
      pastTodos: props.input.pastTodos,
      pastRetrospects: props.input.pastRetrospects,
      overallGoal: props.input.overallGoal,
      output: props.output,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    await this.repository.save(typeOrmEntity);
  }

  async findById(id: string): Promise<GoalRecommendationAggregate | null> {
    const entity = await this.repository.findOne({ where: { uid: id } });
    if (!entity) {
      return null;
    }

    return this.toDomainEntity(entity);
  }

  async findByUserId(userId: string): Promise<GoalRecommendationAggregate[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findLatestByUserId(
    userId: string,
  ): Promise<GoalRecommendationAggregate | null> {
    const entity = await this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (!entity) {
      return null;
    }

    return this.toDomainEntity(entity);
  }

  async findByPromptId(
    promptId: string,
  ): Promise<GoalRecommendationAggregate[]> {
    const entities = await this.repository.find({
      where: { promptId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findAll(
    limit?: number,
    offset?: number,
  ): Promise<GoalRecommendationAggregate[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('goal_recommendation')
      .orderBy('goal_recommendation.createdAt', 'DESC');

    if (offset) {
      queryBuilder.skip(offset);
    }

    if (limit) {
      queryBuilder.take(limit);
    }

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByUid(uid: string): Promise<GoalRecommendationAggregate | null> {
    const entity = await this.repository.findOne({ where: { uid } });
    if (!entity) {
      return null;
    }

    return this.toDomainEntity(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ uid: id });
  }

  async deleteByUid(uid: string): Promise<boolean> {
    const result = await this.repository.delete({ uid });
    return result.affected !== undefined && result.affected > 0;
  }

  private toDomainEntity(
    entity: GoalRecommendationTypeOrmEntity,
  ): GoalRecommendationAggregate {
    const props = {
      id: entity.id,
      uid: entity.uid,
      userId: entity.userId,
      promptId: entity.promptId,
      input: {
        mentorType: entity.mentorType,
        pastTodos: entity.pastTodos,
        pastRetrospects: entity.pastRetrospects,
        overallGoal: entity.overallGoal,
      },
      output: entity.output,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return GoalRecommendationAggregate.fromPersistence(props as any);
  }
}
