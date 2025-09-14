import { Injectable } from '@nestjs/common';
import { MentorType, IntimacyLevel } from '../../common/enums';
import { PromptUtils } from '../../common/utils';

@Injectable()
export class PromptTemplateService {
  generateAdvicePrompt(
    mentorType: MentorType,
    recentTodos: string[],
    weeklyRetrospects: string[],
    intimacyLevel: IntimacyLevel,
  ): string {
    return PromptUtils.generateAdvicePrompt(
      mentorType,
      recentTodos,
      weeklyRetrospects,
      intimacyLevel,
    );
  }

  generateGoalPrompt(
    mentorType: MentorType,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    intimacyLevel: IntimacyLevel,
  ): string {
    return PromptUtils.generateGoalPrompt(
      mentorType,
      pastTodos,
      pastRetrospects,
      overallGoal,
      intimacyLevel,
    );
  }

  getFallbackAdvice(mentorType: MentorType): string {
    return PromptUtils.getFallbackAdvice(mentorType);
  }
}
