import { Inject, Injectable, Logger } from '@nestjs/common';
import { PromptTemplate } from '../domain/prompt-template.domain';
import { PromptTemplateRepository } from '../domain/repositories/prompt-template.repository';
import { MentorType } from '../domain/value-objects/mentor-type.vo';

@Injectable()
export class PromptTemplateService {
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
    let template: PromptTemplate | null = null;

    // 먼저 UID로 조회 시도
    template = await this.promptTemplateRepository.findByUid(promptId);

    // UID로 찾지 못한 경우, promptId에서 name과 type 추출해서 조회
    if (!template) {
      const promptType = this.extractPromptTypeFromPromptId(promptId);
      const mentorName = this.extractMentorNameFromPromptId(promptId);

      if (promptType && mentorName) {
        template = await this.promptTemplateRepository.findByNameAndType(
          mentorName,
          promptType,
        );
      }
    }

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
        : '미완료 투두가 없습니다';

    const pastWeeklyGoalsText =
      pastWeeklyGoals.length > 0
        ? pastWeeklyGoals.join(', ')
        : '과거 주차 목표가 없습니다';

    const retrospectsText =
      weeklyRetrospects.length > 0
        ? weeklyRetrospects.join(', ')
        : '주간 회고가 없습니다';

    const fullPrompt = template.generateFullPrompt();
    const finalPrompt = fullPrompt
      .replace('{최종 목표}', overallGoalText)
      .replace('{과거 완료 투두}', completedTodosText)
      .replace('{미완료 투두}', incompleteTodosText)
      .replace('{과거 주차 목표}', pastWeeklyGoalsText)
      .replace('{주간 회고}', retrospectsText);

    this.logger.log(
      `Generated full prompt for ${promptId}: ${finalPrompt.substring(0, 100)}...`,
    );

    return finalPrompt;
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
    let template: PromptTemplate | null = null;

    // 먼저 UID로 조회 시도
    template = await this.promptTemplateRepository.findByUid(promptId);

    // UID로 찾지 못한 경우, promptId에서 name과 type 추출해서 조회
    if (!template) {
      const promptType = this.extractPromptTypeFromPromptId(promptId);
      const mentorName = this.extractMentorNameFromPromptId(promptId);

      if (promptType && mentorName) {
        template = await this.promptTemplateRepository.findByNameAndType(
          mentorName,
          promptType,
        );
      }
    }

    if (!template) {
      throw new Error(`Template not found for promptId: ${promptId}`);
    }

    const todosText =
      pastTodos.length > 0 ? pastTodos.join(', ') : '과거 투두가 없습니다';

    const completedTodosText =
      completedTodos && completedTodos.length > 0
        ? completedTodos.join(', ')
        : '완료된 투두가 없습니다';

    const pastWeeklyGoalsText =
      pastWeeklyGoals && pastWeeklyGoals.length > 0
        ? pastWeeklyGoals.join(', ')
        : '과거 주차 목표가 없습니다';

    const fullPrompt = template.generateFullPrompt();
    const finalPrompt = fullPrompt
      .replace('{최종 목표}', overallGoal || '목표가 설정되지 않음')
      .replace('{과거 완료 투두}', completedTodosText)
      .replace('{미완료 투두}', todosText)
      .replace('{과거 주차 목표}', pastWeeklyGoalsText)
      .replace(
        '{최종 목표까지 남은 기간}',
        remainingTime || '기간이 설정되지 않음',
      );

    this.logger.log(`Generated full prompt for ${promptId}: ${finalPrompt}`);

    return finalPrompt;
  }

  async getTemplate(uid: string): Promise<PromptTemplate | null> {
    return await this.promptTemplateRepository.findByUid(uid);
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

  /**
   * 프롬프트 ID에서 멘토 타입을 추출합니다.
   * 예: "피터레벨스_조언_프롬프트" -> MentorType['피터 레벨스']
   */
  extractMentorTypeFromPromptId(promptId: string): MentorType | null {
    const mentorTypes = Object.values(MentorType);

    for (const mentorType of mentorTypes) {
      // 정확히 일치하는지 확인 (공백 포함)
      if (promptId === mentorType) {
        return mentorType;
      }

      // 멘토 이름에서 공백 제거하여 비교
      const mentorNameWithoutSpace = mentorType.replace(/\s+/g, '');
      const promptIdWithoutSpace = promptId.replace(/\s+/g, '');
      if (promptIdWithoutSpace.includes(mentorNameWithoutSpace)) {
        return mentorType;
      }
    }

    return null;
  }

  /**
   * 프롬프트 ID에서 프롬프트 타입을 추출합니다.
   * 예: "피터레벨스_조언_프롬프트" -> "조언"
   */
  extractPromptTypeFromPromptId(promptId: string): string | null {
    if (promptId.includes('조언')) {
      return '조언';
    } else if (promptId.includes('목표')) {
      return '목표추천';
    }
    return null;
  }

  /**
   * 프롬프트 ID로 데이터베이스에서 프롬프트 정보를 조회합니다.
   */
  async getPromptInfoByPromptId(promptId: string): Promise<{
    type: string;
    name: string;
    mentorType?: MentorType;
  } | null> {
    try {
      this.logger.debug(`Getting prompt info for promptId: ${promptId}`);

      let template: PromptTemplate | null = null;

      // 먼저 UID로 조회 시도
      template = await this.promptTemplateRepository.findByUid(promptId);
      this.logger.debug(`Template found by UID: ${template ? 'Yes' : 'No'}`);

      // UID로 찾지 못한 경우, promptId에서 name과 type 추출해서 조회
      if (!template) {
        const promptType = this.extractPromptTypeFromPromptId(promptId);
        const mentorName = this.extractMentorNameFromPromptId(promptId);
        this.logger.debug(
          `Extracted promptType: ${promptType}, mentorName: ${mentorName}`,
        );

        if (promptType && mentorName) {
          template = await this.promptTemplateRepository.findByNameAndType(
            mentorName,
            promptType,
          );
          this.logger.debug(
            `Template found by name and type: ${template ? 'Yes' : 'No'}`,
          );
        }
      }

      if (!template) {
        this.logger.warn(`Template not found for promptId: ${promptId}`);
        return null;
      }

      this.logger.debug(
        `Template found - name: ${template.name}, type: ${template.type}`,
      );

      // name에서 멘토 타입 추출
      const mentorType = this.extractMentorTypeFromPromptId(template.name);
      this.logger.debug(
        `Extracted mentorType from template.name: ${mentorType}`,
      );

      return {
        type: template.type,
        name: template.name,
        mentorType: mentorType || undefined,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get prompt info for ${promptId}:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * 프롬프트 ID에서 멘토 이름을 추출합니다.
   * 예: "피터레벨스_조언_프롬프트" -> "피터레벨스"
   */
  extractMentorNameFromPromptId(promptId: string): string | null {
    const mentorTypes = Object.values(MentorType);

    for (const mentorType of mentorTypes) {
      const mentorNameWithoutSpace = mentorType.replace(/\s+/g, '');
      if (promptId.includes(mentorNameWithoutSpace)) {
        return mentorNameWithoutSpace;
      }
    }

    return null;
  }
}
