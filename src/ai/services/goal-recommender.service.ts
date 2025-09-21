import { Injectable, Logger } from '@nestjs/common';
import { MentorType } from '../domain/value-objects/mentor-type.vo';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

@Injectable()
export class GoalRecommenderService {
  private readonly logger = new Logger(GoalRecommenderService.name);

  constructor(
    private readonly openaiService: OpenAIService,
    private readonly promptTemplateService: PromptTemplateService,
  ) {}

  async recommendGoal(
    mentorType: MentorType,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): Promise<string> {
    try {
      const prompt = await this.promptTemplateService.generateGoalPrompt(
        mentorType,
        pastTodos,
        pastRetrospects,
        overallGoal,
      );

      const goal = await this.openaiService.generateGoal(prompt);
      this.logger.log(`Generated goal for mentor ${mentorType}: ${goal}`);

      return goal;
    } catch (error) {
      this.logger.error(
        `Failed to generate goal for mentor ${mentorType}:`,
        error.message,
      );

      const fallbackGoal = this.getSimpleFallback(mentorType);
      this.logger.warn(`Using fallback goal: ${fallbackGoal}`);

      return fallbackGoal;
    }
  }

  private getSimpleFallback(mentorType: MentorType): string {
    const fallbacks = {
      [MentorType.팀쿡]: '이번 주 프로젝트 진행하기',
      [MentorType.공자]: '이번 주 꾸준히 학습하기',
      [MentorType.워렌버핏]: '이번 주 투자 공부하기',
    };
    return fallbacks[mentorType];
  }
}
