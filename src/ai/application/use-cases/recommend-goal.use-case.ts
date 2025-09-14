import { Injectable, Logger } from '@nestjs/common';
import { match } from 'ts-pattern';
import { MentorType, IntimacyLevel } from '../../../common/enums';
import {
  GoalDomainService,
  GenerateGoalCommand,
  GoalResult,
} from '../../domain/services/goal-domain.service';

export interface RecommendGoalUseCaseCommand {
  mentorType: MentorType;
  userId: string;
  pastTodos: string[];
  pastRetrospects: string[];
  overallGoal: string;
  intimacyLevel: IntimacyLevel;
}

export interface RecommendGoalUseCaseResult {
  success: boolean;
  weeklyGoal: string;
  mentorType: MentorType;
  generatedAt: Date;
  isFallback: boolean;
  error?: string;
}

@Injectable()
export class RecommendGoalUseCase {
  private readonly logger = new Logger(RecommendGoalUseCase.name);

  constructor(private readonly goalDomainService: GoalDomainService) {}

  async execute(
    command: RecommendGoalUseCaseCommand,
  ): Promise<RecommendGoalUseCaseResult> {
    this.logger.log(
      `Recommending goal for user ${command.userId} with mentor ${command.mentorType}`,
    );

    // 입력 검증
    const validationResult = this.validateCommand(command);
    if (!validationResult.isValid) {
      return {
        success: false,
        weeklyGoal: this.getDefaultGoal(command.mentorType),
        mentorType: command.mentorType,
        generatedAt: new Date(),
        isFallback: true,
        error: validationResult.error,
      };
    }

    // 도메인 서비스 호출
    const domainCommand: GenerateGoalCommand = {
      mentorType: command.mentorType,
      pastTodos: command.pastTodos,
      pastRetrospects: command.pastRetrospects,
      overallGoal: command.overallGoal,
      intimacyLevel: command.intimacyLevel,
    };

    const result = await this.goalDomainService.generateGoal(domainCommand);

    // 결과 로깅
    this.logResult(command.userId, result);

    return {
      success: result.success,
      weeklyGoal: result.goal,
      mentorType: command.mentorType,
      generatedAt: new Date(),
      isFallback: result.isFallback,
      error: result.error,
    };
  }

  private validateCommand(command: RecommendGoalUseCaseCommand): {
    isValid: boolean;
    error?: string;
  } {
    if (!command.userId?.trim()) {
      return { isValid: false, error: 'User ID is required' };
    }

    if (!Object.values(MentorType).includes(command.mentorType)) {
      return { isValid: false, error: 'Invalid mentor type' };
    }

    if (!Object.values(IntimacyLevel).includes(command.intimacyLevel)) {
      return { isValid: false, error: 'Invalid intimacy level' };
    }

    return { isValid: true };
  }

  private getDefaultGoal(mentorType: MentorType): string {
    return match(mentorType)
      .with(MentorType.팀쿡, () => '이번 주 프로젝트 진행하기')
      .with(MentorType.공자, () => '이번 주 꾸준히 학습하기')
      .with(MentorType.워렌버핏, () => '이번 주 투자 공부하기')
      .exhaustive();
  }

  private logResult(userId: string, result: GoalResult): void {
    if (result.success) {
      this.logger.log(
        `Successfully recommended goal for user ${userId}: ${result.goal}`,
      );
    } else {
      this.logger.warn(
        `Failed to recommend goal for user ${userId}, using fallback. Error: ${result.error}`,
      );
    }
  }
}
