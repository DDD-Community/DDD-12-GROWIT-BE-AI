import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PromptTemplate,
  PromptTemplateDomain,
} from '../../domain/prompt-template.domain';
import { PromptTemplateRepository } from '../../domain/repositories/prompt-template.repository';
import { PromptTemplateEntity } from '../entities/prompt-template.entity';

@Injectable()
export class PromptTemplateTypeOrmRepository
  implements PromptTemplateRepository
{
  constructor(
    @InjectRepository(PromptTemplateEntity)
    private readonly repository: Repository<PromptTemplateEntity>,
  ) {}

  async save(template: PromptTemplate): Promise<PromptTemplate> {
    const entity = this.toEntity(template);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findByUid(uid: string): Promise<PromptTemplate | null> {
    const entity = await this.repository.findOne({ where: { uid } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<PromptTemplate | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByNameAndType(
    name: string,
    type: string,
  ): Promise<PromptTemplate | null> {
    const entity = await this.repository.findOne({
      where: { name, type },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<PromptTemplate[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async deleteByUid(uid: string): Promise<boolean> {
    const result = await this.repository.delete({ uid });
    return result.affected > 0;
  }

  private toEntity(domain: PromptTemplate): PromptTemplateEntity {
    const entity = new PromptTemplateEntity();
    entity.uid = domain.uid;
    entity.name = domain.name;
    entity.type = domain.type;
    entity.personaAndStyle = domain.personaAndStyle;
    entity.webSearchProtocol = domain.webSearchProtocol;
    entity.outputRules = domain.outputRules;
    entity.insufficientContext = domain.insufficientContext;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  private toDomain(entity: PromptTemplateEntity): PromptTemplate {
    return new PromptTemplateDomain(
      entity.name,
      entity.type,
      entity.personaAndStyle,
      entity.webSearchProtocol,
      entity.outputRules,
      entity.insufficientContext,
      entity.uid,
      entity.uid,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
