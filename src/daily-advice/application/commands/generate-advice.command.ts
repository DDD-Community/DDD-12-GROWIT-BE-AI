import { AdviceAggregate } from '../../domain/advice.domain';

export class GenerateAdviceCommand {
  constructor(
    public readonly userId: string,
    public readonly promptId: string,
    public readonly mentorType: string,
    public readonly completedTodos: string[],
    public readonly incompleteTodos: string[],
    public readonly pastWeeklyGoals: string[],
    public readonly weeklyRetrospects: string[],
    public readonly overallGoal: string,
  ) {}
}

export interface AdviceResult {
  success: boolean;
  entity: AdviceAggregate | null;
  error?: string;
}
