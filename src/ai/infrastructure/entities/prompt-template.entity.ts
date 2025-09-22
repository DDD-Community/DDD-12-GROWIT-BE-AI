import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prompt_template')
@Unique(['name', 'type'])
export class PromptTemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('json')
  mentorProfile: {
    occupation?: string;
    age?: string;
    personality?: string;
    speakingStyle?: string;
    skills?: string[];
    expertise?: string;
    personaAndStyle?: string;
    outputRules?: string;
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
