import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('goal_recommendation')
export class GoalRecommendationTypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  promptId: string;

  @Column()
  mentorType: string;

  @Column('simple-array')
  pastTodos: string[];

  @Column('simple-array')
  pastRetrospects: string[];

  @Column('text')
  overallGoal: string;

  @Column('text')
  output: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
