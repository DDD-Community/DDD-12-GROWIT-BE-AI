import { AdviceMode } from '@/common/enums/advice-mode.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RealtimeAdviceRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  goalId: string;

  @IsString()
  @IsNotEmpty()
  goalTitle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  concern: string;

  @IsEnum(AdviceMode)
  @IsNotEmpty()
  mode: AdviceMode;

  @IsOptional()
  @IsString({ each: true })
  recentTodos?: string[];

  @IsNotEmpty()
  isGoalOnboardingCompleted: boolean;
}
