import { AiRole } from './ai-role.domain';

export class Ai {
  private constructor(
    public readonly id: string, // uuid
    public readonly summary: string, // 요약
    public readonly role: AiRole, // AI의 역할
    public readonly displayName?: string, // 이름 (ex: 스티브잡스)
    public readonly description?: string, // 실제 챗지피티 return 값
  ) {}
}
