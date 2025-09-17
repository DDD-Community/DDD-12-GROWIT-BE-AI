import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prompt_template')
export class PromptTemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uid: string;

  @Column()
  name: string;

  @Column('text')
  personaAndStyle: string;

  @Column('text')
  outputRules: string;

  @Column('text')
  insufficientContext: string;

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
