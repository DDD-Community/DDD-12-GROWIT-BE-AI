import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class GoalRecommendationInputDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'pastTodos must contain at least one item' })
  pastTodos: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, {
    message: 'pastRetrospects must contain at least one item',
  })
  pastRetrospects: string[];

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'overallGoal must be at least 10 characters long' })
  overallGoal: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedTodos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  pastWeeklyGoals?: string[];

  @IsOptional()
  @IsString()
  remainingTime?: string;
}

export class GenerateGoalRecommendationRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  promptId: string;

  @ValidateNested()
  @Type(() => GoalRecommendationInputDto)
  input: GoalRecommendationInputDto;
}

export class GenerateGoalRecommendationResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  userId: string;

  @IsString()
  promptId: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  output: string | null;

  @IsOptional()
  @IsDate()
  generatedAt: Date | null;

  @IsOptional()
  @IsString()
  error?: string;
}

export class GoalRecommendationResponseDto {
  @IsString()
  id: string;

  @IsString()
  uid: string;

  @IsString()
  userId: string;

  @IsString()
  promptId: string;

  input: GoalRecommendationInputDto;

  @IsString()
  output: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class GoalRecommendationSummaryDto {
  @IsString()
  id: string;

  @IsString()
  uid: string;

  @IsString()
  promptId: string;

  @IsString()
  output: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ListGoalRecommendationResponseDto {
  @IsBoolean()
  success: boolean;

  goalRecommendations: GoalRecommendationResponseDto[];
}

export class DeleteGoalRecommendationResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;
}
