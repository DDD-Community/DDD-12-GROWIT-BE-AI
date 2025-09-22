import {
  PromptTemplate,
  PromptTemplateDomain,
} from '../prompt-template.domain';
import { PromptTemplateRepository } from '../repositories/prompt-template.repository';

export interface PromptTemplateDomainService {
  upsertTemplate(template: PromptTemplate): Promise<PromptTemplate>;
}

export class PromptTemplateDomainServiceImpl
  implements PromptTemplateDomainService
{
  constructor(
    private readonly promptTemplateRepository: PromptTemplateRepository,
  ) {}

  async upsertTemplate(template: PromptTemplate): Promise<PromptTemplate> {
    const existingTemplate =
      await this.promptTemplateRepository.findByNameAndType(
        template.name,
        template.type,
      );

    if (existingTemplate) {
      const updatedTemplate = (
        existingTemplate as PromptTemplateDomain
      ).updateContent(template.mentorProfile);
      return await this.promptTemplateRepository.save(updatedTemplate);
    } else {
      return await this.promptTemplateRepository.save(template);
    }
  }
}
