import { AiRole } from '../ai-role.domain';

export interface AiRoleRepository {
  create(aiRole: AiRole): Promise<AiRole>;
}
