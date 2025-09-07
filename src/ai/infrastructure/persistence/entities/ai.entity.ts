import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { CommonEntity } from '../../../../common/entities/common.entity';
import { AiRoleEntity } from './ai-role.entity';

export enum AiStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('ai')
@Index(['status'])
@Index(['roleId'])
export class AiEntity extends CommonEntity {
  @Column({ type: 'text', nullable: false })
  summary: string;

  @Column({
    type: 'enum',
    enum: AiStatus,
    default: AiStatus.ACTIVE,
  })
  status: AiStatus;

  @Column({ type: 'int', nullable: false })
  roleId: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'json', default: () => "'[]'" })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  configuration: Record<string, any>;

  @ManyToOne(() => AiRoleEntity, (role) => role.ais, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: AiRoleEntity;

  @Column({ type: 'json', nullable: true, default: null })
  metadata: Record<string, any>;
}
