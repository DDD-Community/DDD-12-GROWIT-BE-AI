import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(1024)
  @Max(65535)
  @IsOptional()
  PORT: number = 8001;

  // Database
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  // OpenAI
  @IsString()
  OPENAI_API_KEY: string;

  // Scheduler
  @IsOptional()
  SCHEDULER_ENABLED?: boolean = true;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints)
          : [];
        return `${error.property}: ${constraints.join(', ')}`;
      })
      .join('\n');

    throw new Error(`Configuration validation error:\n${errorMessages}`);
  }

  return validatedConfig;
}
