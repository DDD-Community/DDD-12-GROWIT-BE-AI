import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserInterface,
  UserProfileInterface,
} from '../../domain/user.interface';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<UserInterface | null> {
    const user = await this.userRepository.findOne({
      where: { uid: id },
    });

    if (!user) return null;

    return this.mapToUserInterface(user);
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) return null;

    return this.mapToUserInterface(user);
  }

  async findUserProfileById(id: string): Promise<UserProfileInterface | null> {
    const user = await this.userRepository.findOne({
      where: { uid: id },
    });

    if (!user) return null;

    return this.mapToUserProfileInterface(user);
  }

  async getUserProfile(id: string): Promise<UserProfileInterface | null> {
    return this.findUserProfileById(id);
  }

  private mapToUserInterface(user: User): UserInterface {
    return {
      id: user.uid,
      email: user.email,
      name: user.name,
      careerYear: user.careerYear,
      isDeleted: !user.isActive,
      isOnboarding: false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  private mapToUserProfileInterface(user: User): UserProfileInterface {
    return {
      id: user.uid,
      email: user.email,
      name: user.name,
      careerYear: user.careerYear,
    };
  }
}
