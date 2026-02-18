import { FourPillarsDto } from '@/forceteller/presentation/dto/four-pillars.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MorningAdviceRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString({ each: true })
  goalTitles: string[];

  @IsOptional()
  @IsString({ each: true })
  recentTodos: string[];

  @IsString()
  @IsOptional()
  previousConversations: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FourPillarsDto)
  manseRyok?: FourPillarsDto;
}
