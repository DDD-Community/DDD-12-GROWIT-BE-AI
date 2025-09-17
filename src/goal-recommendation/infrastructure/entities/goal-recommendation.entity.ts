import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid } from 'nanoid';

@Entity('goal_recommendation')
export class GoalRecommendationTypeOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

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

  @BeforeInsert()
  generateUid() {
    if (!this.uid) {
      this.uid = nanoid();
    }
  }
}
