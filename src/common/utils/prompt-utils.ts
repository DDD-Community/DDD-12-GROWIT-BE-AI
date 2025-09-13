import { MentorType, IntimacyLevel } from '../enums';
import {
  MENTOR_ADVICE_PROMPTS,
  MENTOR_GOAL_PROMPTS,
  DEFAULT_ADVICE_TEMPLATES,
} from '../../config/mentor-prompts.config';

export class PromptUtils {
  static generateAdvicePrompt(
    mentorType: MentorType,
    recentTodos: string[],
    weeklyRetrospects: string[],
    intimacyLevel: IntimacyLevel,
  ): string {
    const template = MENTOR_ADVICE_PROMPTS[mentorType];
    const basePrompt = template.basePrompt;
    const intimacyModifier = template.intimacyModifiers[intimacyLevel];

    const todosText =
      recentTodos.length > 0
        ? recentTodos.join(', ')
        : '작성된 투두가 없습니다';

    const retrospectsText =
      weeklyRetrospects.length > 0
        ? weeklyRetrospects.join(', ')
        : '작성된 회고가 없습니다';

    return (
      basePrompt
        .replace('{이번주 유저의 투두}', todosText)
        .replace('{전체 주간 회고}', retrospectsText) + intimacyModifier
    );
  }

  static generateGoalPrompt(
    mentorType: MentorType,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    intimacyLevel: IntimacyLevel,
  ): string {
    const template = MENTOR_GOAL_PROMPTS[mentorType];
    const basePrompt = template.basePrompt;
    const intimacyModifier = template.intimacyModifiers[intimacyLevel];

    const todosText =
      pastTodos.length > 0 ? pastTodos.join(', ') : '과거 투두가 없습니다';

    const retrospectsText =
      pastRetrospects.length > 0
        ? pastRetrospects.join(', ')
        : '과거 회고가 없습니다';

    return (
      basePrompt
        .replace('{과거 유저의 투두}', todosText)
        .replace('{과거 주간 회고}', retrospectsText)
        .replace('{전체 목표}', overallGoal || '목표가 설정되지 않음') +
      intimacyModifier
    );
  }

  static getFallbackAdvice(mentorType: MentorType): string {
    return DEFAULT_ADVICE_TEMPLATES[mentorType];
  }

  static validateResponse(response: string): boolean {
    if (!response || response.trim().length === 0) {
      return false;
    }

    const sentences = response
      .split(/[.!?]/)
      .filter((s) => s.trim().length > 0);
    return sentences.length >= 2 && sentences.length <= 3;
  }

  static validateGoalResponse(response: string): boolean {
    if (!response || response.trim().length === 0) {
      return false;
    }

    const trimmed = response.trim();
    return trimmed.length >= 10 && trimmed.length <= 20;
  }
}
