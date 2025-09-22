import { IsBoolean, IsDate, IsObject, IsString } from 'class-validator';
import { MentorProfile } from '../domain/prompt-template.domain';

export class CreatePromptTemplateRequestDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsObject()
  mentorProfile: MentorProfile;
}

export class PromptTemplateResponseDto {
  @IsString()
  id: string;

  @IsString()
  uid: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsObject()
  mentorProfile: MentorProfile;

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
