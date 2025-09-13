import { UserInterface, UserProfileInterface } from '../user.interface';

export interface UserRepository {
  findById(id: string): Promise<UserInterface | null>;
  findByEmail(email: string): Promise<UserInterface | null>;
  findUserProfileById(id: string): Promise<UserProfileInterface | null>;
  getUserProfile(id: string): Promise<UserProfileInterface | null>;
}
