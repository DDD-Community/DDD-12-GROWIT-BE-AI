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

  @Column('text')
  personaAndStyle: string;

  @Column('text')
  webSearchProtocol: string;

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
