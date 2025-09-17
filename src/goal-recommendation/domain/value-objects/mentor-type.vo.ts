import { MentorType as CommonMentorType } from '../../../common/enums/mentor-type.enum';

export enum MentorType {
  TIM_COOK = '팀쿡',
  CONFUCIUS = '공자',
  WARREN_BUFFET = '워렌버핏',
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

  getCommonMentorType(): CommonMentorType {
    switch (this.value) {
      case MentorType.TIM_COOK:
        return CommonMentorType.팀쿡;
      case MentorType.CONFUCIUS:
        return CommonMentorType.공자;
      case MentorType.WARREN_BUFFET:
        return CommonMentorType.워렌버핏;
      default:
        throw new Error(`Unknown mentor type: ${this.value}`);
    }
  }

  equals(other: MentorTypeVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isTimCook(): boolean {
    return this.value === MentorType.TIM_COOK;
  }

  isConfucius(): boolean {
    return this.value === MentorType.CONFUCIUS;
  }

  isWarrenBuffet(): boolean {
    return this.value === MentorType.WARREN_BUFFET;
  }
}
