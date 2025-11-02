import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GoalDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class KptDto {
  @IsOptional()
  @IsString()
  keep?: string;

  @IsOptional()
  @IsString()
  problem?: string;

  @IsOptional()
  @IsString()
  try?: string;
}

export class RetrospectDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => KptDto)
  kpt?: KptDto;
}

export class TodoDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  completed: boolean;
}

export class GenerateRetrospectAnalysisRequestDto {
  @IsNotEmpty()
  @IsString()
  goalId: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GoalDto)
  goal: GoalDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RetrospectDto)
  retrospects: RetrospectDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TodoDto)
  todos: TodoDto[];
}

export class AnalysisDto {
  summary: string;
  advice: string;
}

export class GenerateRetrospectAnalysisResponseDto {
  success: boolean;
  goalId: string;
  todoCompletedRate?: number;
  analysis?: AnalysisDto;
  error?: string;
}
