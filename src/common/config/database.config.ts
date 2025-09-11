import { registerAs } from '@nestjs/config';
import { AiEntity } from '@/ai/infrastructure/persistence/entities/ai.entity';
import { AiRoleEntity } from '@/ai/infrastructure/persistence/entities/ai-role.entity';

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [AiEntity, AiRoleEntity],
  synchronize: true, // 개발환경에서만 true
  logging: process.env.NODE_ENV === 'development',
}));
