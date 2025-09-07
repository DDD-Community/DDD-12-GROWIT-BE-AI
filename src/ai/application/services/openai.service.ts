import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 멘토성격 } from '../../domain/vo/mentor';

export interface AiGenerationResult {
  summary: string;
  displayName: string;
  description: string;
  personality: string;
  command: string;
  mentorPersonality: 멘토성격;
}

@Injectable()
export class OpenAiService {
  constructor(private configService: ConfigService) {}

  // TODO :: 개발 예정 (Role, Ai 정책에 따라)
}
