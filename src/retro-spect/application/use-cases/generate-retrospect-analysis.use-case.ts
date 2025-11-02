import { Injectable, Logger } from '@nestjs/common';
import { Analysis } from '../../domain/value-objects';
import { GoalRetrospectDomainService } from '../../domain/services/goal-retrospect.domain.service';
import { GenerateRetrospectAnalysisCommand } from '../commands/generate-retrospect-analysis.command';

export interface GenerateRetrospectAnalysisResult {
  success: boolean;
  todoCompletedRate: number;
  analysis: Analysis | null;
  error?: string;
}

@Injectable()
export class GenerateRetrospectAnalysisUseCase {
  private readonly logger = new Logger(GenerateRetrospectAnalysisUseCase.name);

  constructor(
    private readonly goalRetrospectDomainService: GoalRetrospectDomainService,
  ) {}

  async execute(
    command: GenerateRetrospectAnalysisCommand,
  ): Promise<GenerateRetrospectAnalysisResult> {
    this.logger.log(
      `Generating retrospect analysis for goal ${command.goalId}`,
    );

    try {
      // Generate retrospect through domain service
      const domainResult =
        await this.goalRetrospectDomainService.generateGoalRetrospect({
          goal: command.goal,
          retrospects: command.retrospects,
          todos: command.todos,
        });

      if (!domainResult.success || !domainResult.analysis) {
        this.logger.error(`Domain service failed: ${domainResult.error}`);
        return domainResult;
      }

      this.logger.log(
        `Successfully generated retrospect analysis for goal ${command.goalId}`,
      );

      return domainResult;
    } catch (error) {
      this.logger.error(
        `Failed to generate retrospect analysis: ${error.message}`,
        error.stack,
      );

      return {
        success: false,
        todoCompletedRate: 0,
        analysis: null,
        error: `Failed to generate retrospect analysis: ${error.message}`,
      };
    }
  }
}
