import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  PromptTemplate,
  PromptTemplateDomain,
} from '../../domain/prompt-template.domain';
import { PromptTemplateRepository } from '../../domain/repositories/prompt-template.repository';
import { PromptInfoService } from '../../domain/services/prompt-info.service';
import { MentorType } from '../../domain/value-objects/mentor-type.vo';

@Injectable()
export class PromptTemplateService implements PromptInfoService {
  private readonly logger = new Logger(PromptTemplateService.name);

  constructor(
    @Inject('PromptTemplateRepository')
    private readonly promptTemplateRepository: PromptTemplateRepository,
  ) {}

  async generateAdvicePromptByPromptId(
    promptId: string,
    overallGoal: string,
    completedTodos: string[],
    incompleteTodos: string[],
    pastWeeklyGoals: string[],
    weeklyRetrospects: string[],
  ): Promise<string> {
    const template = await this.promptTemplateRepository.findByUid(promptId);

    if (!template) {
      throw new Error(`Template not found for promptId: ${promptId}`);
    }

    const overallGoalText = overallGoal || '설정된 최종 목표가 없습니다';

    const completedTodosText =
      completedTodos.length > 0
        ? completedTodos.join(', ')
        : '완료된 투두가 없습니다';

    const incompleteTodosText =
      incompleteTodos.length > 0
        ? incompleteTodos.join(', ')
        : '진행 중인 투두가 없습니다';

    const pastWeeklyGoalsText =
      pastWeeklyGoals.length > 0
        ? pastWeeklyGoals.join(', ')
        : '이전 주간 목표가 없습니다';

    const weeklyRetrospectsText =
      weeklyRetrospects.length > 0
        ? weeklyRetrospects.join(', ')
        : '주간 회고가 없습니다';

    const promptParts = [
      template.mentorProfile.personaAndStyle,
      `\n\n사용자 정보:
전체 목표: ${overallGoalText}
완료된 투두: ${completedTodosText}
진행 중인 투두: ${incompleteTodosText}
이전 주간 목표: ${pastWeeklyGoalsText}
주간 회고: ${weeklyRetrospectsText}`,
      `\n\n위 정보를 바탕으로 KPT(Keep, Problem, Try) 형식으로 오늘의 조언을 제공해주세요.

반드시 다음 JSON 형식으로만 응답해주세요:
{
  "keep": "잘하고 있는 점이나 계속해야 할 것 (1-2문장)",
  "try": "앞으로 시도해볼 새로운 방법이나 개선 방안 (1-2문장)",
  "problem": "개선이 필요한 부분이나 해결해야 할 문제 (1-2문장)"
}

JSON 형식 외의 다른 텍스트는 포함하지 마세요.`,
      template.mentorProfile.outputRules,
    ];

    const prompt = promptParts.filter(Boolean).join('\n\n');

    return prompt;
  }

  async generateGoalPromptByPromptId(
    promptId: string,
    pastTodos: string[],
    pastRetrospects: string[],
    overallGoal: string,
    completedTodos?: string[],
    pastWeeklyGoals?: string[],
    remainingTime?: string,
  ): Promise<string> {
    const template = await this.promptTemplateRepository.findByUid(promptId);

    if (!template) {
      throw new Error(`Template not found for promptId: ${promptId}`);
    }

    const overallGoalText = overallGoal || '설정된 최종 목표가 없습니다';

    const pastTodosText =
      pastTodos.length > 0 ? pastTodos.join(', ') : '과거 투두가 없습니다';

    const pastRetrospectsText =
      pastRetrospects.length > 0
        ? pastRetrospects.join(', ')
        : '과거 회고가 없습니다';

    const completedTodosText =
      completedTodos && completedTodos.length > 0
        ? completedTodos.join(', ')
        : '완료된 투두가 없습니다';

    const pastWeeklyGoalsText =
      pastWeeklyGoals && pastWeeklyGoals.length > 0
        ? pastWeeklyGoals.join(', ')
        : '이전 주간 목표가 없습니다';

    const remainingTimeText = remainingTime || '남은 시간 정보가 없습니다';

    const promptParts = [
      template.mentorProfile.personaAndStyle,
      `\n\n사용자 정보:
전체 목표: ${overallGoalText}
과거 투두: ${pastTodosText}
과거 회고: ${pastRetrospectsText}
완료된 투두: ${completedTodosText}
이전 주간 목표: ${pastWeeklyGoalsText}
남은 시간: ${remainingTimeText}`,
      `\n\n위 정보를 바탕으로 이번 주에 달성할 수 있는 구체적이고 실행 가능한 목표를 추천해주세요.`,
      template.mentorProfile.outputRules,
    ];

    const prompt = promptParts.filter(Boolean).join('\n\n');

    return prompt;
  }

  async getPromptInfoByPromptId(promptId: string): Promise<{
    type: string;
    mentorType: MentorType | null;
  } | null> {
    const template = await this.promptTemplateRepository.findByUid(promptId);

    if (!template) {
      return null;
    }

    const mentorType = this.extractMentorTypeFromTemplate(template);

    return {
      type: template.type,
      mentorType,
    };
  }

  async getTemplateByUid(uid: string): Promise<PromptTemplate | null> {
    return await this.promptTemplateRepository.findByUid(uid);
  }

  async getTemplate(uid: string): Promise<PromptTemplate | null> {
    return await this.promptTemplateRepository.findByUid(uid);
  }

  async getAllTemplates(): Promise<PromptTemplate[]> {
    return await this.promptTemplateRepository.findAll();
  }

  async deleteTemplate(uid: string): Promise<boolean> {
    return await this.promptTemplateRepository.deleteByUid(uid);
  }

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

  private extractMentorTypeFromTemplate(
    template: PromptTemplate,
  ): MentorType | null {
    const mentorType = Object.values(MentorType).find(
      (type) => type === template.name,
    );

    return mentorType || null;
  }
}
