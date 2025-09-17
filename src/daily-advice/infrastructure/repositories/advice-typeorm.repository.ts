import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdviceAggregate } from '../../domain/advice.domain';
import { AdviceRepository } from '../../domain/advice.repository';
import { AdviceEntity } from '../entities/advice.entity';

@Injectable()
export class AdviceTypeOrmRepository implements AdviceRepository {
  constructor(
    @InjectRepository(AdviceEntity)
    private readonly repository: Repository<AdviceEntity>,
  ) {}

  async save(entity: AdviceAggregate): Promise<void> {
    const props = entity.toPersistence();

    const typeOrmEntity = this.repository.create({
      id: props.id,
      userId: props.userId.getValue(),
      promptId: props.promptId,
      input: {
        mentorType: props.input.mentorType.toString(),
        recentTodos: props.input.recentTodos,
        weeklyRetrospects: props.input.weeklyRetrospects,
        overallGoal: props.input.overallGoal,
      },
      output: props.output,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });

    await this.repository.save(typeOrmEntity);
  }

  async findById(id: string): Promise<AdviceAggregate | null> {
    const entity = await this.repository.findOne({ where: { uid: id } });
    if (!entity) {
      return null;
    }

    return this.toDomainEntity(entity);
  }

  async findByUserId(userId: string): Promise<AdviceAggregate[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByPromptId(promptId: string): Promise<AdviceAggregate[]> {
    const entities = await this.repository.find({
      where: { promptId },
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findAll(limit?: number, offset?: number): Promise<AdviceAggregate[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('advice')
      .orderBy('advice.createdAt', 'DESC');

    if (offset) {
      queryBuilder.skip(offset);
    }

    if (limit) {
      queryBuilder.take(limit);
    }

    const entities = await queryBuilder.getMany();
    return entities.map((entity) => this.toDomainEntity(entity));
  }

  async findByUid(uid: string): Promise<AdviceAggregate | null> {
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

  private toDomainEntity(entity: AdviceEntity): AdviceAggregate {
    const props = {
      id: entity.id,
      userId: entity.userId,
      promptId: entity.promptId,
      input: {
        mentorType: entity.input.mentorType,
        recentTodos: entity.input.recentTodos,
        weeklyRetrospects: entity.input.weeklyRetrospects,
        overallGoal: entity.input.overallGoal,
      },
      output: entity.output,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return AdviceAggregate.fromPersistence(props as any);
  }
}
