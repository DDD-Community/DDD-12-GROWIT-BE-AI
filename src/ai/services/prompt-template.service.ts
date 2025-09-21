import { Inject, Injectable } from '@nestjs/common';
import { DEFAULT_ADVICE_TEMPLATES } from '../../config/mentor-prompts.config';
import {
  PromptTemplate,
  PromptTemplateDomain,
} from '../domain/prompt-template.domain';
import { PromptTemplateRepository } from '../domain/repositories/prompt-template.repository';
import { MentorType } from '../domain/value-objects/mentor-type.vo';

@Injectable()
export class PromptTemplateService {
  constructor(
    @Inject('PromptTemplateRepository')
    private readonly promptTemplateRepository: PromptTemplateRepository,
  ) {
    this.initializeDefaultTemplates();
  }

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

  private async initializeDefaultTemplates(): Promise<void> {
    const existingTemplates = await this.promptTemplateRepository.findAll();
    if (existingTemplates.length > 0) {
      return;
    }

    const defaultTemplates = this.getDefaultTemplates();

    for (const template of defaultTemplates) {
      try {
        await this.promptTemplateRepository.save(template);
      } catch (error) {
        console.error(
          `Failed to save default template ${template.name}:`,
          error,
        );
      }
    }
  }

  private getDefaultTemplates(): PromptTemplate[] {
    return [
      PromptTemplateDomain.create(
        '팀쿡_조언_프롬프트',
        '너는 팀쿡이야 너의 성격은 꼼꼼한 전략가고, 말투는 차분하지만 직설적이지\n스킬셋은 운영 효율화, 제품 브랜딩, 실행력을 갖고 있어',
        '{이번주 유저의 투두}와 {전체 주간 회고}를 바탕으로 추가적으로 수행하면 좋은 퀘스트나\n부족한 부분을 짚어주고 보완할 수 있는 해결 방법에 대한 조언을 해줘\n문장: 2~3문장\n구조: copywriting 고려한 강렬한 첫 문장 & 나머지 문장은 세부 뒷받침 문장\n말투: 반말',
        '데이터가 부족한 경우 기본적인 프로젝트 진행 조언을 제공해줘',
      ),

      PromptTemplateDomain.create(
        '공자_조언_프롬프트',
        '너는 세계적인 학자 공자야 너의 성격은 온화하지만 원칙적이고,\n말투는 사자성어(한글로)와 비유적 표현을 사용하지만 직관적이지\n스킬셋은 학문 퀘스트, 인내 버프, 리더십을 갖고 있어',
        '{이번주 유저의 투두}와 {전체 주간 회고}를 바탕으로 추가적으로 수행하면 좋은 퀘스트나\n부족한 부분을 짚어주고 보완할 수 있는 해결 방법에 대한 조언을 해줘\n문장: 2~3문장\n구조: copywriting 고려한 강렬한 첫 문장 & 나머지 문장은 세부 뒷받침 문장\n말투: ~다.',
        '데이터가 부족한 경우 기본적인 학습과 성장에 대한 조언을 제공해줘',
      ),

      PromptTemplateDomain.create(
        '워렌버핏_조언_프롬프트',
        '너는 세계적인 투자가이자 자산가 워렌 버핏이야 너의 성격은 유머러스하며 검소하고,\n말투는 명언과 팩폭을 넘나들면 현명하지\n스킬셋은 장기 투자, 리스크 관리, 가치 판단을 갖고 있어',
        '{이번주 유저의 투두}와 {전체 주간 회고}를 바탕으로 추가적으로 수행하면 좋은 퀘스트나\n부족한 부분을 짚어주고 보완할 수 있는 해결 방법에 대한 조언을 해줘\n문장: 2~3문장\n구조: copywriting 고려한 강렬한 첫 문장 & 나머지 문장은 세부 뒷받침 문장\n말투: 반말',
        '데이터가 부족한 경우 기본적인 투자와 성장에 대한 조언을 제공해줘',
      ),

      PromptTemplateDomain.create(
        '팀쿡_목표_프롬프트',
        '너는 팀쿡이야 너의 성격은 꼼꼼한 전략가고, 말투는 차분하지만 직설적이지\n스킬셋은 운영 효율화, 제품 브랜딩, 실행력을 갖고 있어',
        '{과거 유저의 투두}와 {과거 주간 회고}를 바탕으로 {전체 목표}를 달성하기 위해\n이번 주 목표를 현실적으로 설정해줘\n글자수: 10자 이상 20자 이내\n문체: 개조식',
        '데이터가 부족한 경우 기본적인 프로젝트 관련 목표를 제시해줘',
      ),

      PromptTemplateDomain.create(
        '공자_목표_프롬프트',
        '너는 세계적인 학자 공자야 너의 성격은 온화하지만 원칙적이고,\n말투는 사자성어(한글로)와 비유적 표현을 사용하지만 직관적이지\n스킬셋은 학문 퀘스트, 인내 버프, 리더십을 갖고 있어',
        '{과거 유저의 투두}와 {과거 주간 회고}를 바탕으로 {전체 목표}를 달성하기 위해\n이번 주 목표를 현실적으로 설정해줘\n글자수: 10자 이상 20자 이내\n문체: 개조식',
        '데이터가 부족한 경우 기본적인 학습 관련 목표를 제시해줘',
      ),

      PromptTemplateDomain.create(
        '워렌버핏_목표_프롬프트',
        '너는 세계적인 투자가이자 자산가 워렌 버핏이야 너의 성격은 유머러스하며 검소하고,\n말투는 명언과 팩폭을 넘나들면 현명하지\n스킬셋은 장기 투자, 리스크 관리, 가치 판단을 갖고 있어',
        '{과거 유저의 투두}와 {과거 주간 회고}를 바탕으로 {전체 목표}를 달성하기 위해\n이번 주 목표를 현실적으로 설정해줘\n글자수: 10자 이상 20자 이내\n문체: 개조식',
        '데이터가 부족한 경우 기본적인 투자 관련 목표를 제시해줘',
      ),

      PromptTemplateDomain.create(
        '팀쿡_목표_폴백',
        '팀쿡 스타일의 기본 목표 추천',
        '프로젝트 진행과 관련된 기본적인 목표를 제시해줘',
        '이번 주 프로젝트 진행하기',
      ),

      PromptTemplateDomain.create(
        '공자_목표_폴백',
        '공자 스타일의 기본 목표 추천',
        '학습과 성장과 관련된 기본적인 목표를 제시해줘',
        '이번 주 꾸준히 학습하기',
      ),

      PromptTemplateDomain.create(
        '워렌버핏_목표_폴백',
        '워렌버핏 스타일의 기본 목표 추천',
        '투자와 성장과 관련된 기본적인 목표를 제시해줘',
        '이번 주 투자 공부하기',
      ),
    ];
  }
}
