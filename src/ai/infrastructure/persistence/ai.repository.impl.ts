import { InjectRepository } from '@nestjs/typeorm';
import { AiEntity } from './entities/ai.entity';
import { Repository } from 'typeorm';
import { AiRepository } from '../../domain/repositories/ai.repository';
import { Ai } from '../../domain/ai.domain';

export class AiRepositoryImpl implements AiRepository {
  constructor(
    @InjectRepository(AiEntity)
    private readonly aiRepository: Repository<AiEntity>,
  ) {}
  save(ai: Ai): Promise<Ai> {
    throw new Error('Method not implemented.');
  }
}
