import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../../../../common/entities/common.entity';
import { AiRoleEntity } from './ai-role.entity';

export enum AiStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('ai')
@Index(['role'])
export class AiEntity extends CommonEntity {
  @Column({ type: 'text', nullable: false })
  summary: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  displayName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => AiRoleEntity, (role) => role.ai, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: AiRoleEntity;
}
