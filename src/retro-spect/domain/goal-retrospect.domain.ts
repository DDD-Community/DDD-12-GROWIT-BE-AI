import { customAlphabet } from 'nanoid';
import { Analysis } from './value-objects';

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

export interface GoalRetrospectProps {
  id?: number;
  uid: string;
  goalId: string;
  todoCompletedRate: number;
  analysis: Analysis;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GoalRetrospectAggregate {
  readonly id?: number;
  readonly uid: string;
  readonly goalId: string;
  readonly todoCompletedRate: number;
  readonly analysis: Analysis;
  private _content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: GoalRetrospectProps) {
    this.id = props.id;
    this.uid = props.uid;
    this.goalId = props.goalId;
    this.todoCompletedRate = props.todoCompletedRate;
    this.analysis = props.analysis;
    this._content = props.content;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.validate();
  }

  get content(): string {
    return this._content;
  }

  private validate(): void {
    if (!this.uid || this.uid.trim().length === 0) {
      throw new Error('UID is required');
    }
    if (!this.goalId || this.goalId.trim().length === 0) {
      throw new Error('Goal ID is required');
    }
    if (this.todoCompletedRate < 0 || this.todoCompletedRate > 100) {
      throw new Error('Todo completed rate must be between 0 and 100');
    }
    if (!this.analysis) {
      throw new Error('Analysis is required');
    }
  }

  updateContent(newContent: string): void {
    if (!newContent || newContent.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }
    this._content = newContent;
  }

  static create(
    goalId: string,
    todoCompletedRate: number,
    analysis: Analysis,
    content: string,
  ): GoalRetrospectAggregate {
    const now = new Date();
    return new GoalRetrospectAggregate({
      uid: nanoid(),
      goalId,
      todoCompletedRate,
      analysis,
      content,
      createdAt: now,
      updatedAt: now,
    });
  }
}
