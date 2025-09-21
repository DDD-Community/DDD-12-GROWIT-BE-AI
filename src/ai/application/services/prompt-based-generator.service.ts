import { Injectable, Logger } from '@nestjs/common';
import { AdviceGeneratorService } from './advice-generator.service';
import { GoalRecommenderService } from './goal-recommender.service';
import { PromptTemplateService } from './prompt-template.service';

export interface PromptGenerationRequest {
  promptId: string;
  overallGoal: string;
  completedTodos: string[];
  incompleteTodos: string[];
  pastWeeklyGoals: string[];
  weeklyRetrospects: string[];
  pastTodos?: string[];
  pastRetrospects?: string[];
  remainingTime?: string;
}

export interface PromptGenerationResponse {
  success: boolean;
  type: '조언' | '목표추천';
  mentorName: string;
  content: string;
  error?: string;
}

@Injectable()
export class PromptBasedGeneratorService {
  private readonly logger = new Logger(PromptBasedGeneratorService.name);

  constructor(
    private readonly adviceGenerator: AdviceGeneratorService,
    private readonly goalRecommender: GoalRecommenderService,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  /**
   * 프롬프트 ID를 기반으로 자동으로 조언 또는 목표 추천을 생성합니다.
   */
  async generateByPromptId(
    request: PromptGenerationRequest,
  ): Promise<PromptGenerationResponse> {
    try {
      const { promptId } = request;

      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(promptId);

      if (!promptInfo) {
        throw new Error(`Prompt template not found: ${promptId}`);
      }

      const mentorName = promptInfo.mentorType?.toString() || '알 수 없는 멘토';

      if (promptInfo.type === '조언') {
        const content = await this.adviceGenerator.generateAdviceByPromptId(
          promptId,
          request.overallGoal,
          request.completedTodos,
          request.incompleteTodos,
          request.pastWeeklyGoals,
          request.weeklyRetrospects,
        );

        return {
          success: true,
          type: '조언',
          mentorName,
          content,
        };
      } else if (promptInfo.type === '목표추천') {
        const content = await this.goalRecommender.recommendGoalByPromptId(
          promptId,
          request.pastTodos || [],
          request.pastRetrospects || [],
          request.overallGoal,
          request.completedTodos,
          request.pastWeeklyGoals,
          request.remainingTime,
        );

        return {
          success: true,
          type: '목표추천',
          mentorName,
          content,
        };
      } else {
        throw new Error(`Unsupported prompt type: ${promptInfo.type}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to generate content for prompt ${request.promptId}:`,
        error.message,
      );

      return {
        success: false,
        type: '조언',
        mentorName: '알 수 없는 멘토',
        content: '',
        error: error.message,
      };
    }
  }
}
