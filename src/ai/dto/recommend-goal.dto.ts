import {
  IsEnum,
  IsString,
  IsArray,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { MentorType, IntimacyLevel } from '../../common/enums';

export class RecommendGoalRequestDto {
  @IsEnum(MentorType)
  mentorType: MentorType;

  @IsString()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  pastTodos: string[];

  @IsArray()
  @IsString({ each: true })
  pastRetrospects: string[];

  @IsString()
  overallGoal: string;

  @IsEnum(IntimacyLevel)
  intimacyLevel: IntimacyLevel;
}

export class RecommendGoalResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  weeklyGoal: string;

  @IsEnum(MentorType)
  mentorType: MentorType;

  @IsDate()
  generatedAt: Date;

  @IsOptional()
  @IsString()
  error?: string;
}
