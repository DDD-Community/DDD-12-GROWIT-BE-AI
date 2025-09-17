import { nanoid } from 'nanoid';
import { MentorTypeVO } from './value-objects/mentor-type.vo';
import { UserId } from './value-objects/user-id.vo';

export interface GoalRecommendationProps {
  id: string;
  userId: UserId;
  promptId: string;
  input: GoalRecommendationInput;
  output: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalRecommendationInput {
  mentorType: MentorTypeVO;
  pastTodos: string[];
  pastRetrospects: string[];
  overallGoal: string;
}

// Aggregate Root
export class GoalRecommendationAggregate {
  private constructor(private readonly props: GoalRecommendationProps) {}

  static create(
    userId: string,
    promptId: string,
    mentorType: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): GoalRecommendationAggregate {
    const now = new Date();
    return new GoalRecommendationAggregate({
      id: nanoid(),
      userId: UserId.create(userId),
      promptId: promptId,
      input: {
        mentorType: MentorTypeVO.create(mentorType),
        pastTodos,
        pastRetrospects,
        overallGoal,
      },
      output: '',
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(
    props: GoalRecommendationProps,
  ): GoalRecommendationAggregate {
    // VO 객체들을 재생성
    const reconstructedProps: GoalRecommendationProps = {
      ...props,
      userId: UserId.create(props.userId.getValue()),
      input: {
        ...props.input,
        mentorType: MentorTypeVO.create(props.input.mentorType.toString()),
      },
    };
    return new GoalRecommendationAggregate(reconstructedProps);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get promptId(): string {
    return this.props.promptId;
  }

  get input(): GoalRecommendationInput {
    return this.props.input;
  }

  get output(): string {
    return this.props.output;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Domain methods
  updateOutput(output: string): void {
    this.props.output = output;
    this.props.updatedAt = new Date();
  }

  toPersistence(): GoalRecommendationProps {
    return {
      ...this.props,
      userId: this.props.userId,
      input: {
        ...this.props.input,
        mentorType: this.props.input.mentorType,
      },
    };
  }

  // Business rules
  isCompleted(): boolean {
    return this.props.output.length > 0;
  }

  getInputAsJson(): string {
    return JSON.stringify(this.props.input);
  }
}
