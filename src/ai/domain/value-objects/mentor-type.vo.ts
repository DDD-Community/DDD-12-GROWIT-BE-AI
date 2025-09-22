export enum MentorType {
  팀쿡 = '팀쿡',
  공자 = '공자',
  워렌버핏 = '워렌버핏',
}

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

  equals(other: MentorTypeVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
