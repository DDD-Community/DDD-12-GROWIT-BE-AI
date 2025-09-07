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
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly lastUsedAt: Date | null = null,
  ) {}

  static create(summary: string, role: AiRole): Ai {
    const ai = new Ai(
      crypto.randomUUID(),
      summary,
      role,
      AiStatus.ACTIVE,
    );

    return ai;
  }
}
