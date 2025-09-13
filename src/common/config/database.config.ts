import { AiEntity } from '@/ai/infrastructure/persistence/entities/ai.entity';
import { AiRoleEntity } from '@/ai/infrastructure/persistence/entities/ai-role.entity';
import { DailyAdviceEntity } from '@/ai/infrastructure/persistence/entities/daily-advice.entity';
import { registerAs } from '@nestjs/config';
import {
  GoalRetrospect,
  Retrospect,
} from '../../retrospect/infrastructure/persistence/entities/retrospect.entity';
import { Todo } from '../../todo/infrastructure/persistence/entities/todo.entity';
import { User } from '../../user/infrastructure/persistence/entities/user.entity';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    AiEntity,
    AiRoleEntity,
    DailyAdviceEntity,
    User,
    Todo,
    Retrospect,
    GoalRetrospect,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
}));
