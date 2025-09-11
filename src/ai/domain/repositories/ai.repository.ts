import { Ai } from '../ai.domain';

export interface AiRepository {
  save(ai: Ai): Promise<Ai>;
}
