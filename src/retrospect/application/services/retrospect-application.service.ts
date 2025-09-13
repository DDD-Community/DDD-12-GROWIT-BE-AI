import { Injectable } from '@nestjs/common';
import { RetrospectInterface } from '../../domain/retrospect.interface';
import { RetrospectRepository } from '../../infrastructure/persistence/retrospect.repository';

@Injectable()
export class RetrospectApplicationService {
  constructor(private readonly retrospectRepository: RetrospectRepository) {}

  async getRetrospectsByUserId(userId: string): Promise<RetrospectInterface[]> {
    return await this.retrospectRepository.findByUserId(userId);
  }

  async getRetrospectById(id: string): Promise<RetrospectInterface | null> {
    return await this.retrospectRepository.findById(id);
  }
}
