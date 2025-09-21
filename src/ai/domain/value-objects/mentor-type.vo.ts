export enum MentorType {
  팀쿡 = '팀쿡',
  공자 = '공자',
  워렌버핏 = '워렌버핏',
}

export const MENTOR_NAMES = {
  [MentorType.팀쿡]: '팀쿡',
  [MentorType.공자]: '공자',
  [MentorType.워렌버핏]: '워렌버핏',
} as const;

export const MENTOR_DESCRIPTIONS = {
  [MentorType.팀쿡]: '사이드 프로젝트 멘토 - 꼼꼼한 전략가',
  [MentorType.공자]: '스터디 멘토 - 온화하지만 원칙적',
  [MentorType.워렌버핏]: '재테크 멘토 - 유머러스하며 검소',
} as const;

export class MentorTypeVO {
  private constructor(private readonly value: MentorType) {}

  static create(value: string): MentorTypeVO {
    const mentorType = Object.values(MentorType).find((type) => type === value);
    if (!mentorType) {
      throw new Error(`Invalid mentor type: ${value}`);
    }
    return new MentorTypeVO(mentorType);
  }

  getValue(): MentorType {
    return this.value;
  }

  getMentorType(): MentorType {
    return this.value;
  }

  equals(other: MentorTypeVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isTimCook(): boolean {
    return this.value === MentorType.팀쿡;
  }

  isConfucius(): boolean {
    return this.value === MentorType.공자;
  }

  isWarrenBuffet(): boolean {
    return this.value === MentorType.워렌버핏;
  }
}
