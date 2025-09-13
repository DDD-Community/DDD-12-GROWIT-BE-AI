import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CareerYear, CareerYearEnum } from '../../../domain/vo/career-year';

@Entity('users', { synchronize: false })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uid', unique: true })
  uid: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'nickname', nullable: true })
  nickname?: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'mentor_type', nullable: true })
  mentorType?: string;

  @Column({
    name: 'career_year',
    type: 'enum',
    enum: CareerYearEnum,
    default: 'JUNIOR',
  })
  careerYear: CareerYear;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}
