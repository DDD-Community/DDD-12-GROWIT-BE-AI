import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class CreatePromptTemplateRequestDto {
  @IsString()
  name: string;

  @IsString()
  prompt: string;
}

export class UpdatePromptTemplateRequestDto {
  @IsString()
  promptId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  prompt?: string;
}

export class PromptTemplateResponseDto {
  @IsString()
  promptId: string;

  @IsString()
  name: string;

  @IsString()
  prompt: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class GetPromptTemplateRequestDto {
  @IsString()
  promptId: string;
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
