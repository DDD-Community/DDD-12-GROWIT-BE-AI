import { Injectable } from '@nestjs/common';
import { Analysis } from '../value-objects';
import {
  RetrospectAnalyzer,
  RetrospectAnalysisInput,
} from './retrospect-analyzer.interface';

export interface GenerateGoalRetrospectResult {
  success: boolean;
  todoCompletedRate: number;
  analysis: Analysis | null;
  error?: string;
}

@Injectable()
export class GoalRetrospectDomainService {
  constructor(private readonly retrospectAnalyzer: RetrospectAnalyzer) {}

  async generateGoalRetrospect(
    input: RetrospectAnalysisInput,
  ): Promise<GenerateGoalRetrospectResult> {
    try {
      // 1. Calculate todo completion rate
      const completedCount = input.todos.filter(
        (todo) => todo.completed,
      ).length;
      const totalCount = input.todos.length;
      const todoCompletedRate =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // 2. Generate AI analysis
      const analysis = await this.retrospectAnalyzer.generateAnalysis(input);

      return {
        success: true,
        todoCompletedRate,
        analysis,
      };
    } catch (error) {
      return {
        success: false,
        todoCompletedRate: 0,
        analysis: null,
        error: error.message || 'Failed to generate goal retrospect',
      };
    }
  }
}
