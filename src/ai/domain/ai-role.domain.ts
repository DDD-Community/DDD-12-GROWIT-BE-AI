import { 멘토직업, 멘토성격 } from './vo/mentor';

export class AiRole {
  private constructor(
    public readonly id: string, // uuid
    public readonly personality: string, // 성격
    public readonly command: string, // 실제 chatgpt에 인입될 명령어
    public readonly mentorCategory: 멘토직업,
    public readonly mentorPersonality: 멘토성격,
    public readonly isActive: boolean = true,
  ) {}
}
