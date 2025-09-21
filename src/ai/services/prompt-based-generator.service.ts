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

      // 데이터베이스에서 프롬프트 정보 조회
      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(promptId);

      if (!promptInfo) {
        throw new Error(`Prompt template not found: ${promptId}`);
      }

      const { type, name, mentorType } = promptInfo;

      this.logger.log(
        `Generating ${type} for prompt ${name} (mentor: ${mentorType || 'unknown'})`,
      );

      let content: string;

      if (type === '조언') {
        // 조언 생성
        content = await this.adviceGenerator.generateAdviceByPromptId(
          promptId,
          request.overallGoal,
          request.completedTodos,
          request.incompleteTodos,
          request.pastWeeklyGoals,
          request.weeklyRetrospects,
        );
      } else if (type === '목표추천') {
        // 목표 추천 생성
        if (
          !request.pastTodos ||
          !request.pastRetrospects ||
          !request.overallGoal
        ) {
          throw new Error(
            'Missing required fields for goal recommendation: pastTodos, pastRetrospects, overallGoal',
          );
        }

        content = await this.goalRecommender.recommendGoalByPromptId(
          promptId,
          request.pastTodos,
          request.pastRetrospects,
          request.overallGoal,
          request.completedTodos,
          request.pastWeeklyGoals,
          request.remainingTime,
        );
      } else {
        throw new Error(`Unsupported prompt type: ${type}`);
      }

      return {
        success: true,
        type: type as '조언' | '목표추천',
        mentorName: mentorType || '알 수 없음',
        content,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate content for prompt ${request.promptId}:`,
        error.message,
      );

      return {
        success: false,
        type: '조언', // 기본값
        mentorName: '알 수 없음',
        content: '생성에 실패했습니다. 다시 시도해주세요.',
        error: error.message,
      };
    }
  }
}
