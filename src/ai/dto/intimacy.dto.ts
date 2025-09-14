import {
  IsEnum,
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { IntimacyLevel } from '../../common/enums';

export class GetIntimacyResponseDto {
  @IsBoolean()
  success: boolean;

  @IsEnum(IntimacyLevel)
  intimacyLevel: IntimacyLevel;

  @IsString()
  description: string;

  @IsNumber()
  totalTodos: number;

  @IsNumber()
  weeklyRetrospects: number;

  @IsDate()
  calculatedAt: Date;

  @IsOptional()
  @IsString()
  error?: string;
}
