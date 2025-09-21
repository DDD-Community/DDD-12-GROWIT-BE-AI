import { nanoid } from 'nanoid';
import { MentorTypeVO } from '../../ai/domain/value-objects/mentor-type.vo';
import { UserId } from './value-objects/user-id.vo';

export interface GoalRecommendationProps {
  id: number;
  uid: string;
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
  completedTodos?: string[];
  pastWeeklyGoals?: string[];
  remainingTime?: string;
}

export class GoalRecommendationAggregate {
  private constructor(private readonly props: GoalRecommendationProps) {}

  static create(
    userId: string,
    promptId: string,
    mentorType: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    completedTodos?: string[],
    pastWeeklyGoals?: string[],
    remainingTime?: string,
  ): GoalRecommendationAggregate {
    const now = new Date();
    return new GoalRecommendationAggregate({
      id: 0,
      uid: nanoid(),
      userId: UserId.create(userId),
      promptId: promptId,
      input: {
        mentorType: MentorTypeVO.create(mentorType),
        pastTodos,
        pastRetrospects,
        overallGoal,
        completedTodos,
        pastWeeklyGoals,
        remainingTime,
      },
      output: '',
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(
    props: Omit<GoalRecommendationProps, 'userId' | 'input'> & {
      userId: string;
      input: Omit<GoalRecommendationInput, 'mentorType'> & {
        mentorType: string;
      };
    },
  ): GoalRecommendationAggregate {
    const reconstructedProps: GoalRecommendationProps = {
      ...props,
      userId: UserId.create(props.userId),
      input: {
        ...props.input,
        mentorType: MentorTypeVO.create(props.input.mentorType),
      },
    };
    return new GoalRecommendationAggregate(reconstructedProps);
  }

  get id(): number {
    return this.props.id;
  }

  get uid(): string {
    return this.props.uid;
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

  isCompleted(): boolean {
    return this.props.output.length > 0;
  }

  getInputAsJson(): string {
    return JSON.stringify(this.props.input);
  }
}
