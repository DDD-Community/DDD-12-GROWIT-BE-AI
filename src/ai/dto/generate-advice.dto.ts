import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { IntimacyLevel, MentorType } from '../../common/enums';

export class GenerateAdviceRequestDto {
  @IsEnum(MentorType)
  mentorType: MentorType;

  @IsString()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  recentTodos: string[];

  @IsArray()
  @IsString({ each: true })
  weeklyRetrospects: string[];

  @IsString()
  overallGoal: string;

  @IsEnum(IntimacyLevel)
  intimacyLevel: IntimacyLevel;
}

export class GenerateAdviceResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  advice: string;

  @IsEnum(MentorType)
  mentorType: MentorType;

  @IsDate()
  generatedAt: Date;

  @IsOptional()
  @IsString()
  error?: string;
}
