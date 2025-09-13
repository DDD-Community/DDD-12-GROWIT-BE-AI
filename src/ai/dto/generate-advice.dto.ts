import {
  IsEnum,
  IsString,
  IsArray,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { MentorType, IntimacyLevel } from '../../common/enums';

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
