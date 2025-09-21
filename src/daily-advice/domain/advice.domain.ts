import { nanoid } from 'nanoid';
import { MentorTypeVO } from '../../ai/domain/value-objects/mentor-type.vo';
import { UserId } from './value-objects/user-id.vo';

export interface AdviceProps {
  id: number;
  uid: string;
  userId: UserId;
  promptId: string;
  input: AdviceInput;
  output: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdviceInput {
  mentorType: MentorTypeVO;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal: string;
}

export class AdviceAggregate {
  private constructor(private readonly props: AdviceProps) {}

  static create(
    userId: string,
    promptId: string,
    mentorType: string,
    recentTodos: string[],
    weeklyRetrospects: string[],
    overallGoal: string,
  ): AdviceAggregate {
    const now = new Date();
    return new AdviceAggregate({
      id: 0,
      uid: nanoid(),
      userId: UserId.create(userId),
      promptId: promptId,
      input: {
        mentorType: MentorTypeVO.create(mentorType),
        recentTodos,
        weeklyRetrospects,
        overallGoal,
      },
      output: '',
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(
    props: Omit<AdviceProps, 'userId' | 'input'> & {
      userId: string;
      input: Omit<AdviceInput, 'mentorType'> & {
        mentorType: string;
      };
    },
  ): AdviceAggregate {
    const reconstructedProps: AdviceProps = {
      ...props,
      userId: UserId.create(props.userId),
      input: {
        ...props.input,
        mentorType: MentorTypeVO.create(props.input.mentorType),
      },
    };
    return new AdviceAggregate(reconstructedProps);
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

  get input(): AdviceInput {
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

  toPersistence(): AdviceProps {
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

  canGenerateAdvice(): boolean {
    return (
      this.props.input.recentTodos.length > 0 ||
      this.props.input.weeklyRetrospects.length > 0
    );
  }
}
