import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('advice')
export class AdviceEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  promptId: string;

  @Column('jsonb')
  input: {
    mentorType: string;
    recentTodos: string[];
    weeklyRetrospects: string[];
    overallGoal: string;
  };

  @Column('text')
  output: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
