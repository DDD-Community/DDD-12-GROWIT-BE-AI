import { match } from 'ts-pattern';
import { MentorType } from './value-objects/mentor-type.vo';

export class Mentor {
  constructor(
    public readonly type: MentorType,
    private readonly characteristics: MentorCharacteristics,
  ) {}

  generateAdviceContext(todos: string[], retrospects: string[]): AdviceContext {
    return new AdviceContext({
      mentorType: this.type,
      basePrompt: this.characteristics.advicePrompt,
      todosText: todos.length > 0 ? todos.join(', ') : '작성된 투두가 없습니다',
      retrospectText:
        retrospects.length > 0
          ? retrospects.join(', ')
          : '작성된 회고가 없습니다',
    });
  }

  generateGoalContext(
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): GoalContext {
    return new GoalContext({
      mentorType: this.type,
      basePrompt: this.characteristics.goalPrompt,
      todosText:
        pastTodos.length > 0 ? pastTodos.join(', ') : '과거 투두가 없습니다',
      retrospectText:
        pastRetrospects.length > 0
          ? pastRetrospects.join(', ')
          : '과거 회고가 없습니다',
      overallGoal: overallGoal || '목표가 설정되지 않음',
    });
  }

  getFallbackAdvice(): string {
    return match(this.type)
      .with(
        MentorType.팀쿡,
        () =>
          '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.',
      )
      .with(
        MentorType.공자,
        () =>
          '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.',
      )
      .with(
        MentorType.워렌버핏,
        () =>
          '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.',
      )
      .exhaustive();
  }

  getFallbackGoal(): string {
    return match(this.type)
      .with(MentorType.팀쿡, () => '이번 주 프로젝트 진행하기')
      .with(MentorType.공자, () => '이번 주 꾸준히 학습하기')
      .with(MentorType.워렌버핏, () => '이번 주 투자 공부하기')
      .exhaustive();
  }
}

export interface MentorCharacteristics {
  readonly name: string;
  readonly description: string;
  readonly advicePrompt: string;
  readonly goalPrompt: string;
}

export class AdviceContext {
  constructor(
    private readonly data: {
      mentorType: MentorType;
      basePrompt: string;
      todosText: string;
      retrospectText: string;
    },
  ) {}

  toPrompt(): string {
    return this.data.basePrompt
      .replace('{이번주 유저의 투두}', this.data.todosText)
      .replace('{전체 주간 회고}', this.data.retrospectText);
  }
}

export class GoalContext {
  constructor(
    private readonly data: {
      mentorType: MentorType;
      basePrompt: string;
      todosText: string;
      retrospectText: string;
      overallGoal: string;
    },
  ) {}

  toPrompt(): string {
    return this.data.basePrompt
      .replace('{과거 유저의 투두}', this.data.todosText)
      .replace('{과거 주간 회고}', this.data.retrospectText)
      .replace('{전체 목표}', this.data.overallGoal);
  }
}
