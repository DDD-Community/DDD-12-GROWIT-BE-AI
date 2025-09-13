import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('retrospects', { synchronize: false })
export class Retrospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uid', unique: true })
  uid: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'goal_id' })
  goalId: string;

  @Column({ name: 'plan_id', nullable: true })
  planId?: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}

@Entity('goal_retrospects', { synchronize: false })
export class GoalRetrospect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uid', unique: true })
  uid: string;

  @Column({ name: 'goal_id' })
  goalId: string;

  @Column({
    name: 'todo_completed_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  todoCompletedRate: number;

  @Column({ name: 'analysis_summary', type: 'text' })
  analysisSummary: string;

  @Column({ name: 'analysis_advice', type: 'text' })
  analysisAdvice: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
