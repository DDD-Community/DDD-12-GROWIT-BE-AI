import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePromptTemplateRequestDto {
  @IsString()
  name: string;

  @IsString()
  personaAndStyle: string;

  @IsString()
  outputRules: string;

  @IsString()
  insufficientContext: string;
}

export class UpdatePromptTemplateRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  personaAndStyle?: string;

  @IsOptional()
  @IsString()
  outputRules?: string;

  @IsOptional()
  @IsString()
  insufficientContext?: string;
}

export class PromptTemplateResponseDto {
  @IsString()
  id: string; // 실제로는 uid 값

  @IsString()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  personaAndStyle: string;

  @IsString()
  outputRules: string;

  @IsString()
  insufficientContext: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ListPromptTemplatesResponseDto {
  @IsBoolean()
  success: boolean;

  promptTemplates: PromptTemplateResponseDto[];
}

export class DeletePromptTemplateResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;
}
