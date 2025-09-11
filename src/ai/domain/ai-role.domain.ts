import { 멘토직업, 멘토성격 } from './vo/mentor';

export class AiRole {
  private constructor(
    public readonly id: string,
    public readonly personality: string,
    public readonly command: string,
    public readonly mentorCategory: 멘토직업,
    public readonly mentorPersonality: 멘토성격,
    public readonly isActive: boolean = true,
  ) {}
}
