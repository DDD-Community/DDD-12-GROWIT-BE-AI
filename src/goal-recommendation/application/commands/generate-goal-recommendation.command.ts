export class GenerateGoalRecommendationCommand {
  constructor(
    public readonly userId: string,
    public readonly promptId: string,
    public readonly mentorType: string,
    public readonly pastTodos: string[],
    public readonly pastRetrospects: string[],
    public readonly overallGoal: string,
  ) {}
}
