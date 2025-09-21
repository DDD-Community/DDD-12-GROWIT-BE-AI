import { AdviceAggregate } from './advice.domain';

export interface AdviceRepository {
  save(entity: AdviceAggregate): Promise<void>;
  findById(id: string): Promise<AdviceAggregate | null>;
  findByUserId(userId: string): Promise<AdviceAggregate[]>;
  findLatestByUserId(userId: string): Promise<AdviceAggregate | null>;
  findByPromptId(promptId: string): Promise<AdviceAggregate[]>;
  findAll(limit?: number, offset?: number): Promise<AdviceAggregate[]>;
  delete(id: string): Promise<void>;
}
