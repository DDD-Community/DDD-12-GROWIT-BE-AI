import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenerateAdviceRequestDto } from './generate-advice.dto';

export class BatchGenerateAdviceRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GenerateAdviceRequestDto)
  requests: GenerateAdviceRequestDto[];
}

export class BatchAdviceResult {
  userId: string;
  success: boolean;
  advice?: string;
  error?: string;
}

export class BatchGenerateAdviceResponseDto {
  @IsBoolean()
  success: boolean;

  @IsNumber()
  totalRequests: number;

  @IsNumber()
  successfulRequests: number;

  @IsArray()
  results: BatchAdviceResult[];

  @IsOptional()
  @IsArray()
  errors?: string[];
}
