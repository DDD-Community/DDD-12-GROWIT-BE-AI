import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prompt_template')
export class PromptTemplateEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  promptId: string;

  @Column()
  name: string;

  @Column('text')
  prompt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
