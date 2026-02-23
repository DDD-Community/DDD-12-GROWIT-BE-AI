import { FourPillarsDto } from '@/forceteller/domain/four-pillars.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
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
  @IsArray()
  @IsString({ each: true })
  goalTitles: string[];

  @IsOptional()
  @IsArray()
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
