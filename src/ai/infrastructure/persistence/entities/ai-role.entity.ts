import { Entity, Column, OneToMany, Index } from 'typeorm';
import { CommonEntity } from '../../../../common/entities/common.entity';
import { AiEntity } from './ai.entity';
import { 멘토직군, 멘토성격 } from '../../../domain/vo/mentor.domain';

@Entity('ai_roles')
@Index(['name'], { unique: true })
@Index(['mentorCategory'])
@Index(['mentorPersonality'])
export class AiRoleEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text' })
  personality: string;

  @Column({ type: 'text' })
  command: string;

  @Column({ type: 'json', default: () => "'[]'" })
  capabilities: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: 멘토직군,
    nullable: false,
  })
  mentorCategory: 멘토직군;

  @Column({
    type: 'enum',
    enum: 멘토성격,
    nullable: false,
  })
  mentorPersonality: 멘토성격;

  @OneToMany(() => AiEntity, (ai) => ai.role, {
    cascade: ['remove'],
  })
  ais: AiEntity[];

  @Column({ type: 'json', nullable: true, default: null })
  metadata: Record<string, any>;
}
