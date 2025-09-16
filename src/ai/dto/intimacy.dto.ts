import {
  IsEnum,
  IsString,
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

  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsString()
  error?: string;
}
