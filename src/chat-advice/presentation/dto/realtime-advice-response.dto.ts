import { AdviceMode } from '@/common/enums/advice-mode.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RealtimeAdviceResponseDto {
  @IsString()
  @IsNotEmpty()
  advice: string;

  @IsEnum(AdviceMode)
  @IsNotEmpty()
  mode: AdviceMode;
}
