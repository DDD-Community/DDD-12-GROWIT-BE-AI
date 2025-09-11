import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ai } from '../../domain/ai.domain';
import { AiRepository } from '../../domain/repositories/ai.repository';
import { AiEntity } from './entities/ai.entity';

export class AiRepositoryImpl implements AiRepository {
  constructor(
    @InjectRepository(AiEntity)
    private readonly aiRepository: Repository<AiEntity>,
  ) {}
  save(_ai: Ai): Promise<Ai> {
    throw new Error('Method not implemented.');
  }
}
