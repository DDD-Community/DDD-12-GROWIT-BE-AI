import { PromptTemplate } from '../prompt-template.domain';

export interface PromptTemplateRepository {
  save(template: PromptTemplate): Promise<PromptTemplate>;
  findByUid(uid: string): Promise<PromptTemplate | null>;
  findByName(name: string): Promise<PromptTemplate | null>;
  findAll(): Promise<PromptTemplate[]>;
  upsert(template: PromptTemplate): Promise<PromptTemplate>;
  deleteByUid(uid: string): Promise<boolean>;
}
