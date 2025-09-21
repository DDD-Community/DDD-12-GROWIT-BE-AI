import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('advice')
export class AdviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

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

  @Column('jsonb')
  output: {
    keep: string;
    try: string;
    problem: string;
  };

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
