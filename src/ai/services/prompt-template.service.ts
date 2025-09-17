import { Injectable } from '@nestjs/common';
import { MentorType } from '../../common/enums';
import { PromptUtils } from '../../common/utils';
import { PromptTemplate } from '../domain/prompt-template.domain';

@Injectable()
export class PromptTemplateService {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
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
  saveTemplate(template: PromptTemplate): void {
    this.templates.set(template.promptId, template);
  }

  getTemplate(promptId: string): PromptTemplate | undefined {
    return this.templates.get(promptId);
  }

  getTemplateById(id: string): PromptTemplate | undefined {
    return Array.from(this.templates.values()).find(
      (template) => template.id === id,
    );
  }

  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  updateTemplate(template: PromptTemplate): void {
    this.templates.set(template.promptId, template);
  }

  deleteTemplate(promptId: string): boolean {
    return this.templates.delete(promptId);
  }

  deleteTemplateById(id: string): boolean {
    const template = this.getTemplateById(id);
    if (template) {
      return this.templates.delete(template.promptId);
    }
    return false;
  }

  private initializeDefaultTemplates(): void {
    const now = new Date();

    // 기본 조언 템플릿들
    const defaultTemplates: PromptTemplate[] = [
      {
        id: 'advice-tim-cook-default-id',
        promptId: 'advice-tim-cook-default',
        name: '팀쿡 기본 조언 템플릿',
        prompt:
          '너는 팀쿡이야 너의 성격은 꼼꼼한 전략가고, 말투는 차분하지만 직설적이지\n스킬셋은 운영 효율화, 제품 브랜딩, 실행력을 갖고 있어\n{이번주 유저의 투두}와 {전체 주간 회고}를 바탕으로 추가적으로 수행하면 좋은 퀘스트나\n부족한 부분을 짚어주고 보완할 수 있는 해결 방법에 대한 조언을 해줘\n문장: 2~3문장\n구조: copywriting 고려한 강렬한 첫 문장 & 나머지 문장은 세부 뒷받침 문장\n말투: 반말',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'advice-confucius-default-id',
        promptId: 'advice-confucius-default',
        name: '공자 기본 조언 템플릿',
        prompt:
          '너는 세계적인 학자 공자야 너의 성격은 온화하지만 원칙적이고,\n말투는 사자성어(한글로)와 비유적 표현을 사용하지만 직관적이지\n스킬셋은 학문 퀘스트, 인내 버프, 리더십을 갖고 있어\n{이번주 유저의 투두}와 {전체 주간 회고}를 바탕으로 추가적으로 수행하면 좋은 퀘스트나\n부족한 부분을 짚어주고 보완할 수 있는 해결 방법에 대한 조언을 해줘\n문장: 2~3문장\n구조: copywriting 고려한 강렬한 첫 문장 & 나머지 문장은 세부 뒷받침 문장\n말투: ~다.',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'advice-warren-buffet-default-id',
        promptId: 'advice-warren-buffet-default',
        name: '워렌버핏 기본 조언 템플릿',
        prompt:
          '너는 세계적인 투자가이자 자산가 워렌 버핏이야 너의 성격은 유머러스하며 검소하고,\n말투는 명언과 팩폭을 넘나들면 현명하지\n스킬셋은 장기 투자, 리스크 관리, 가치 판단을 갖고 있어\n{이번주 유저의 투두}와 {전체 주간 회고}를 바탕으로 추가적으로 수행하면 좋은 퀘스트나\n부족한 부분을 짚어주고 보완할 수 있는 해결 방법에 대한 조언을 해줘\n문장: 2~3문장\n구조: copywriting 고려한 강렬한 첫 문장 & 나머지 문장은 세부 뒷받침 문장\n말투: 반말',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'goal-tim-cook-default-id',
        promptId: 'goal-tim-cook-default',
        name: '팀쿡 기본 목표 템플릿',
        prompt:
          '너는 팀쿡이야 너의 성격은 꼼꼼한 전략가고, 말투는 차분하지만 직설적이지\n스킬셋은 운영 효율화, 제품 브랜딩, 실행력을 갖고 있어\n{과거 유저의 투두}와 {과거 주간 회고}를 바탕으로 {전체 목표}를 달성하기 위해\n이번 주 목표를 현실적으로 설정해줘\n글자수: 10자 이상 20자 이내\n문체: 개조식',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'goal-confucius-default-id',
        promptId: 'goal-confucius-default',
        name: '공자 기본 목표 템플릿',
        prompt:
          '너는 세계적인 학자 공자야 너의 성격은 온화하지만 원칙적이고,\n말투는 사자성어(한글로)와 비유적 표현을 사용하지만 직관적이지\n스킬셋은 학문 퀘스트, 인내 버프, 리더십을 갖고 있어\n{과거 유저의 투두}와 {과거 주간 회고}를 바탕으로 {전체 목표}를 달성하기 위해\n이번 주 목표를 현실적으로 설정해줘\n글자수: 10자 이상 20자 이내\n문체: 개조식',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'goal-warren-buffet-default-id',
        promptId: 'goal-warren-buffet-default',
        name: '워렌버핏 기본 목표 템플릿',
        prompt:
          '너는 세계적인 투자가이자 자산가 워렌 버핏이야 너의 성격은 유머러스하며 검소하고,\n말투는 명언과 팩폭을 넘나들면 현명하지\n스킬셋은 장기 투자, 리스크 관리, 가치 판단을 갖고 있어\n{과거 유저의 투두}와 {과거 주간 회고}를 바탕으로 {전체 목표}를 달성하기 위해\n이번 주 목표를 현실적으로 설정해줘\n글자수: 10자 이상 20자 이내\n문체: 개조식',
        createdAt: now,
        updatedAt: now,
      },
    ];

    defaultTemplates.forEach((template) => {
      this.templates.set(template.promptId, template);
    });
  }
}
