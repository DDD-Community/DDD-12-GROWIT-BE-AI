import { Inject, Injectable } from '@nestjs/common';
import { MentorType } from '../../common/enums';
import { PromptUtils } from '../../common/utils';
import { PromptTemplate } from '../domain/prompt-template.domain';
import { PromptTemplateRepository } from '../domain/repositories/prompt-template.repository';

@Injectable()
export class PromptTemplateService {
  constructor(
    @Inject('PromptTemplateRepository')
    private readonly promptTemplateRepository: PromptTemplateRepository,
  ) {
    this.initializeDefaultTemplates();
  }

  generateAdvicePrompt(
    mentorType: MentorType,
    recentTodos: string[],
    weeklyRetrospects: string[],
  ): string {
    return PromptUtils.generateAdvicePrompt(
      mentorType,
      recentTodos,
      weeklyRetrospects,
    );
  }

  generateGoalPrompt(
    mentorType: MentorType,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): string {
    return PromptUtils.generateGoalPrompt(
      mentorType,
      pastTodos,
      pastRetrospects,
      overallGoal,
    );
  }

  getFallbackAdvice(mentorType: MentorType): string {
    return PromptUtils.getFallbackAdvice(mentorType);
  }

  // 템플릿 관리 메서드들
  async saveTemplate(template: PromptTemplate): Promise<PromptTemplate> {
    return await this.promptTemplateRepository.save(template);
  }

  async getTemplate(uid: string): Promise<PromptTemplate | null> {
    return await this.promptTemplateRepository.findByUid(uid);
  }

  async getTemplateByName(name: string): Promise<PromptTemplate | null> {
    return await this.promptTemplateRepository.findByName(name);
  }

  async getAllTemplates(): Promise<PromptTemplate[]> {
    return await this.promptTemplateRepository.findAll();
  }

  async upsertTemplate(template: PromptTemplate): Promise<PromptTemplate> {
    return await this.promptTemplateRepository.upsert(template);
  }

  async deleteTemplate(uid: string): Promise<boolean> {
    return await this.promptTemplateRepository.deleteByUid(uid);
  }

  private async initializeDefaultTemplates(): Promise<void> {
    const existingTemplates = await this.promptTemplateRepository.findAll();
    if (existingTemplates.length > 0) {
      return;
    }
  }
}
