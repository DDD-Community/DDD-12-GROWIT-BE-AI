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

  async findAll(): Promise<PromptTemplate[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async upsert(template: PromptTemplate): Promise<PromptTemplate> {
    // name으로 기존 템플릿 찾기
    const existingEntity = await this.repository.findOne({
      where: { name: template.name },
    });

    if (existingEntity) {
      // 기존 템플릿이 있으면 업데이트
      existingEntity.personaAndStyle = template.personaAndStyle;
      existingEntity.outputRules = template.outputRules;
      existingEntity.insufficientContext = template.insufficientContext;
      existingEntity.updatedAt = new Date();

      const updatedEntity = await this.repository.save(existingEntity);
      return this.toDomain(updatedEntity);
    } else {
      // 기존 템플릿이 없으면 새로 생성
      const entity = this.toEntity(template);
      const savedEntity = await this.repository.save(entity);
      return this.toDomain(savedEntity);
    }
  }

  async deleteByUid(uid: string): Promise<boolean> {
    const result = await this.repository.delete({ uid });
    return result.affected > 0;
  }

  private toEntity(domain: PromptTemplate): PromptTemplateEntity {
    const entity = new PromptTemplateEntity();
    // id는 데이터베이스에서 자동 생성되므로 설정하지 않음
    entity.uid = domain.uid;
    entity.name = domain.name;
    entity.personaAndStyle = domain.personaAndStyle;
    entity.outputRules = domain.outputRules;
    entity.insufficientContext = domain.insufficientContext;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  private toDomain(entity: PromptTemplateEntity): PromptTemplate {
    return new PromptTemplateDomain(
      entity.name,
      entity.personaAndStyle,
      entity.outputRules,
      entity.insufficientContext,
      entity.uid, // id 필드에 uid 값 반환
      entity.uid,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
