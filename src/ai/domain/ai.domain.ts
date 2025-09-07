import { AiRole } from './ai-role.domain';

export enum AiStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export class Ai {
  private constructor(
    public readonly id: string,
    public readonly summary: string,
    public readonly role: AiRole,
    public readonly status: AiStatus = AiStatus.ACTIVE,
  ) {}
}
