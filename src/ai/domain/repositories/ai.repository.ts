import { Ai, AiStatus } from '../ai.domain';

export interface AiRepository {
  create(ai: Ai): Promise<Ai>;
}
