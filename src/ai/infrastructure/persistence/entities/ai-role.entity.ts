import { Entity, Column, OneToMany, Index } from 'typeorm';
import { CommonEntity } from '../../../../common/entities/common.entity';
import { AiEntity } from './ai.entity';

@Entity('ai_roles')
@Index(['name'], { unique: true })
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

  @OneToMany(() => AiEntity, (ai) => ai.role, {
    cascade: ['remove'],
  })
  ais: AiEntity[];

  @Column({ type: 'json', nullable: true, default: null })
  metadata: Record<string, any>;
}