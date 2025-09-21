export class GenerateGoalRecommendationCommand {
  constructor(
    public readonly userId: string,
    public readonly promptId: string,
    public readonly pastTodos: string[],
    public readonly pastRetrospects: string[],
    public readonly overallGoal: string,
    public readonly completedTodos?: string[],
    public readonly pastWeeklyGoals?: string[],
    public readonly remainingTime?: string,
    public readonly templateUid?: string,
  ) {}
}
