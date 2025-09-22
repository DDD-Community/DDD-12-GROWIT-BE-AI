import { Injectable, Logger } from '@nestjs/common';
import { PromptTemplateDomain } from '../../domain/prompt-template.domain';
import { CreatePromptTemplateRequestDto } from '../../dto/prompt-template.dto';
import { PromptTemplateService } from '../services/prompt-template.service';

@Injectable()
export class CreatePromptTemplateUseCase {
  private readonly logger = new Logger(CreatePromptTemplateUseCase.name);

  constructor(private readonly promptTemplateService: PromptTemplateService) {}

  async execute(
    request: CreatePromptTemplateRequestDto,
  ): Promise<{ success: boolean; id: string }> {
    this.logger.log('Creating or updating prompt template:', request.name);

    const template = PromptTemplateDomain.create(
      request.name,
      request.type,
      request.mentorProfile,
    );

    const savedTemplate =
      await this.promptTemplateService.upsertTemplate(template);

    return { success: true, id: savedTemplate.uid };
  }
}
