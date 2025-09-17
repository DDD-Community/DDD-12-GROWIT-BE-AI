import { nanoid } from 'nanoid';
import { MentorTypeVO } from './value-objects/mentor-type.vo';
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

// Aggregate Root
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

  static fromPersistence(props: AdviceProps): AdviceAggregate {
    // VO 객체들을 재생성
    const reconstructedProps: AdviceProps = {
      ...props,
      userId: UserId.create(props.userId.getValue()),
      input: {
        ...props.input,
        mentorType: MentorTypeVO.create(props.input.mentorType.toString()),
      },
    };
    return new AdviceAggregate(reconstructedProps);
  }

  // Getters
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

  // Domain methods
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

  // Business rules
  isCompleted(): boolean {
    return this.props.output.length > 0;
  }

  getInputAsJson(): string {
    return JSON.stringify(this.props.input);
  }

  // Domain validation
  canGenerateAdvice(): boolean {
    return (
      this.props.input.recentTodos.length > 0 ||
      this.props.input.weeklyRetrospects.length > 0
    );
  }

  getAdviceContext(): string {
    const todosText =
      this.props.input.recentTodos.length > 0
        ? this.props.input.recentTodos.join(', ')
        : '작성된 투두가 없습니다';

    const retrospectText =
      this.props.input.weeklyRetrospects.length > 0
        ? this.props.input.weeklyRetrospects.join(', ')
        : '작성된 회고가 없습니다';

    return `투두: ${todosText}, 회고: ${retrospectText}`;
  }
}
