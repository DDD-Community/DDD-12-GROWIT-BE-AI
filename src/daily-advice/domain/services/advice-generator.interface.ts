import { StructuredAdviceResponseDto } from '../../../ai/dto';

export interface AdviceGenerator {
  generateAdviceByPromptId(
    promptId: string,
    overallGoal: string,
    completedTodos: string[],
    incompleteTodos: string[],
    pastWeeklyGoals: string[],
    weeklyRetrospects: string[],
  ): Promise<StructuredAdviceResponseDto>;
}
