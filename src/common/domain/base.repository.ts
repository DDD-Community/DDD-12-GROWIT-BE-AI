export interface BaseRepository<T> {
  save(entity: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findByUid(uid: string): Promise<T | null>;
  findByUserId(userId: string): Promise<T[]>;
  findByPromptId(promptId: string): Promise<T[]>;
  findAll(limit?: number, offset?: number): Promise<T[]>;
  delete(id: string): Promise<void>;
  deleteByUid(uid: string): Promise<boolean>;
}
