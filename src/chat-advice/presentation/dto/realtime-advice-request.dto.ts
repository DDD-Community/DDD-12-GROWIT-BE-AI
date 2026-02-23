import { AdviceMode } from '@/common/enums/advice-mode.enum';
import { FourPillarsDto } from '@/forceteller/domain/four-pillars.dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
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

  @IsOptional()
  @ValidateNested()
  @Type(() => FourPillarsDto)
  @ValidateIf((o) => o.mode === AdviceMode.사주)
  manseRyok?: FourPillarsDto;

  @IsBoolean()
  @IsNotEmpty()
  isGoalOnboardingCompleted: boolean;
}
