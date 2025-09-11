import { AiRole } from './ai-role.domain';

export class Ai {
  private constructor(
    public readonly id: string,
    public readonly summary: string,
    public readonly role: AiRole,
    public readonly displayName?: string,
    public readonly description?: string,
  ) {}
}
