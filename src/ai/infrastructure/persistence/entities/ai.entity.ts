import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../../../../common/entities/common.entity';
import { AiRoleEntity } from './ai-role.entity';

export enum AiStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('ais')
@Index(['status'])
@Index(['roleId'])
export class AiEntity extends CommonEntity {
  @Column({ type: 'text', nullable: false })
  summary: string;

  @Column({ 
    type: 'enum', 
    enum: AiStatus, 
    default: AiStatus.ACTIVE 
  })
  status: AiStatus;

  @Column({ type: 'int', nullable: false })
  roleId: number;

  @ManyToOne(() => AiRoleEntity, (role) => role.ais, { 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'roleId' })
  role: AiRoleEntity;

  @Column({ type: 'json', nullable: true, default: null })
  metadata: Record<string, any>;
}
