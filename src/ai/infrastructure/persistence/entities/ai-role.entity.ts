import { Entity, Column, OneToMany, Index } from 'typeorm';
import { CommonEntity } from '../../../../common/entities/common.entity';
import { AiEntity } from './ai.entity';
import { 멘토직업, 멘토성격 } from '../../../domain/vo/mentor';

@Entity('ai_roles')
@Index(['mentorCategory'])
@Index(['mentorPersonality'])
export class AiRoleEntity extends CommonEntity {
  @Column({ type: 'text' })
  personality: string;

  @Column({ type: 'text' })
  command: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: 멘토직업,
    nullable: false,
  })
  mentorCategory: 멘토직업;

  @Column({
    type: 'enum',
    enum: 멘토성격,
    nullable: false,
  })
  mentorPersonality: 멘토성격;

  @OneToMany(() => AiEntity, (ai) => ai.role, {
    cascade: ['remove'],
  })
  ai: AiEntity[];
}
