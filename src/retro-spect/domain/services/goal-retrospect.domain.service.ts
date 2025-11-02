import { Injectable } from '@nestjs/common';
import { GoalRetrospectAggregate } from '../goal-retrospect.domain';
import {
  RetrospectAnalyzer,
  RetrospectAnalysisInput,
} from './retrospect-analyzer.interface';

export interface GenerateGoalRetrospectInput {
  goalId: string;
  content: string;
  analysisInput: RetrospectAnalysisInput;
}

export interface GenerateGoalRetrospectResult {
  success: boolean;
  entity: GoalRetrospectAggregate | null;
  error?: string;
}

@Injectable()
export class GoalRetrospectDomainService {
  constructor(private readonly retrospectAnalyzer: RetrospectAnalyzer) {}

  async generateGoalRetrospect(
    input: GenerateGoalRetrospectInput,
  ): Promise<GenerateGoalRetrospectResult> {
    try {
      // 1. Calculate todo completion rate
      const completedCount = input.analysisInput.todos.filter(
        (todo) => todo.completed,
      ).length;
      const totalCount = input.analysisInput.todos.length;
      const todoCompletedRate =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // 2. Generate AI analysis
      const analysis = await this.retrospectAnalyzer.generateAnalysis(
        input.analysisInput,
      );

      // 3. Create domain entity
      const goalRetrospect = GoalRetrospectAggregate.create(
        input.goalId,
        todoCompletedRate,
        analysis,
        input.content,
      );

      return {
        success: true,
        entity: goalRetrospect,
      };
    } catch (error) {
      return {
        success: false,
        entity: null,
        error: error.message || 'Failed to generate goal retrospect',
      };
    }
  }
}
