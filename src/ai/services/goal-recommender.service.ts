import { Injectable, Logger } from '@nestjs/common';
import { MentorType } from '../domain/value-objects/mentor-type.vo';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

export interface GoalRecommender {
  recommendGoalByPromptId(
    promptId: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    completedTodos?: string[],
    pastWeeklyGoals?: string[],
    remainingTime?: string,
  ): Promise<string>;
}

@Injectable()
export class GoalRecommenderService implements GoalRecommender {
  private readonly logger = new Logger(GoalRecommenderService.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async recommendGoalByPromptId(
    promptId: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    completedTodos?: string[],
    pastWeeklyGoals?: string[],
    remainingTime?: string,
  ): Promise<string> {
    try {
      // 데이터베이스에서 프롬프트 정보 조회
      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(promptId);

      if (!promptInfo) {
        throw new Error(`Prompt template not found: ${promptId}`);
      }

      if (promptInfo.type !== '목표추천') {
        throw new Error(
          `Invalid prompt type for goal recommendation: ${promptInfo.type}`,
        );
      }

      const prompt =
        await this.promptTemplateService.generateGoalPromptByPromptId(
          promptId,
          pastTodos,
          pastRetrospects,
          overallGoal,
          completedTodos,
          pastWeeklyGoals,
          remainingTime,
        );

      const goal = await this.openaiService.generateGoal(prompt);
      this.logger.log(`Generated goal for prompt ${promptId}: ${goal}`);

      return goal;
    } catch (error) {
      this.logger.error(
        `Failed to generate goal for prompt ${promptId}:`,
        error.message,
      );

      // 프롬프트 ID에서 멘토 타입을 추출하여 폴백 사용
      const mentorType =
        this.promptTemplateService.extractMentorTypeFromPromptId(promptId);
      const fallbackGoal = mentorType
        ? this.getSimpleFallback(mentorType)
        : '이번 주 목표 설정하기';

      this.logger.warn(`Using fallback goal: ${fallbackGoal}`);

      return fallbackGoal;
    }
  }

  private getSimpleFallback(mentorType: MentorType): string {
    const fallbacks = {
      [MentorType['피터 레벨스']]: '이번 주 프로젝트 진행하기',
      [MentorType['젠슨 황']]: '이번 주 꾸준히 학습하기',
      [MentorType.워렌버핏]: '이번 주 투자 공부하기',
    };
    return fallbacks[mentorType];
  }
}
