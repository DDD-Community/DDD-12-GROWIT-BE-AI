import { Inject, Injectable } from '@nestjs/common';
import { DEFAULT_ADVICE_TEMPLATES } from '../../config/mentor-prompts.config';
import { PromptTemplate } from '../domain/prompt-template.domain';
import { PromptTemplateRepository } from '../domain/repositories/prompt-template.repository';
import { MentorType } from '../domain/value-objects/mentor-type.vo';

@Injectable()
export class PromptTemplateService {
  constructor(
    @Inject('PromptTemplateRepository')
    private readonly promptTemplateRepository: PromptTemplateRepository,
  ) {}

  async generateAdvicePrompt(
    mentorType: MentorType,
    recentTodos: string[],
    weeklyRetrospects: string[],
  ): Promise<string> {
    const templateName = this.getAdviceTemplateName(mentorType);
    const template =
      await this.promptTemplateRepository.findByName(templateName);

    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const todosText =
      recentTodos.length > 0
        ? recentTodos.join(', ')
        : '작성된 투두가 없습니다';

    const retrospectsText =
      weeklyRetrospects.length > 0
        ? weeklyRetrospects.join(', ')
        : '작성된 회고가 없습니다';

    return template
      .generateFullPrompt()
      .replace('{이번주 유저의 투두}', todosText)
      .replace('{전체 주간 회고}', retrospectsText);
  }

  async generateGoalPrompt(
    mentorType: MentorType,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
  ): Promise<string> {
    const templateName = this.getGoalTemplateName(mentorType);
    const template =
      await this.promptTemplateRepository.findByName(templateName);

    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const todosText =
      pastTodos.length > 0 ? pastTodos.join(', ') : '과거 투두가 없습니다';

    const retrospectsText =
      pastRetrospects.length > 0
        ? pastRetrospects.join(', ')
        : '과거 회고가 없습니다';

    return template
      .generateFullPrompt()
      .replace('{과거 유저의 투두}', todosText)
      .replace('{과거 주간 회고}', retrospectsText)
      .replace('{전체 목표}', overallGoal || '목표가 설정되지 않음');
  }

  async getFallbackAdvice(mentorType: MentorType): Promise<string> {
    const templateName = this.getAdviceTemplateName(mentorType);
    const template =
      await this.promptTemplateRepository.findByName(templateName);

    if (!template) {
      return this.getDefaultFallbackAdvice(mentorType);
    }

    return template.insufficientContext;
  }

  async getFallbackGoal(mentorType: MentorType): Promise<string> {
    const fallbackTemplateName = this.getGoalFallbackTemplateName(mentorType);
    const fallbackTemplate =
      await this.promptTemplateRepository.findByName(fallbackTemplateName);

    if (!fallbackTemplate) {
      return this.getDefaultFallbackGoal(mentorType);
    }

    return fallbackTemplate.insufficientContext;
  }

  private getAdviceTemplateName(mentorType: MentorType): string {
    const templateNames = {
      [MentorType.팀쿡]: '팀쿡_조언_프롬프트',
      [MentorType.공자]: '공자_조언_프롬프트',
      [MentorType.워렌버핏]: '워렌버핏_조언_프롬프트',
    };
    return templateNames[mentorType];
  }

  private getGoalTemplateName(mentorType: MentorType): string {
    const templateNames = {
      [MentorType.팀쿡]: '팀쿡_목표_프롬프트',
      [MentorType.공자]: '공자_목표_프롬프트',
      [MentorType.워렌버핏]: '워렌버핏_목표_프롬프트',
    };
    return templateNames[mentorType];
  }

  private getGoalFallbackTemplateName(mentorType: MentorType): string {
    const fallbackTemplateNames = {
      [MentorType.팀쿡]: '팀쿡_목표_폴백',
      [MentorType.공자]: '공자_목표_폴백',
      [MentorType.워렌버핏]: '워렌버핏_목표_폴백',
    };
    return fallbackTemplateNames[mentorType];
  }

  private getDefaultFallbackAdvice(mentorType: MentorType): string {
    return DEFAULT_ADVICE_TEMPLATES[mentorType];
  }

  private getDefaultFallbackGoal(mentorType: MentorType): string {
    const defaultGoals = {
      [MentorType.팀쿡]: '이번 주 프로젝트 진행하기',
      [MentorType.공자]: '이번 주 꾸준히 학습하기',
      [MentorType.워렌버핏]: '이번 주 투자 공부하기',
    };
    return defaultGoals[mentorType];
  }

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
}
