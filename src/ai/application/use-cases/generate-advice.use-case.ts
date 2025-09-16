import { Injectable, Logger } from '@nestjs/common';
import { match } from 'ts-pattern';
import { IntimacyLevel, MentorType } from '../../../common/enums';
import {
  AdviceDomainService,
  AdviceResult,
  GenerateAdviceCommand,
} from '../../domain/services/advice-domain.service';

export interface GenerateAdviceUseCaseCommand {
  mentorType: MentorType;
  userId: string;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal: string;
  intimacyLevel: IntimacyLevel;
}

export interface GenerateAdviceUseCaseResult {
  success: boolean;
  advice: string;
  mentorType: MentorType;
  generatedAt: Date;
  isFallback: boolean;
  error?: string;
}

@Injectable()
export class GenerateAdviceUseCase {
  private readonly logger = new Logger(GenerateAdviceUseCase.name);

  constructor(private readonly adviceDomainService: AdviceDomainService) {}

  async execute(
    command: GenerateAdviceUseCaseCommand,
  ): Promise<GenerateAdviceUseCaseResult> {
    this.logger.log(
      `Generating advice for user ${command.userId} with mentor ${command.mentorType}`,
    );

    // 입력 검증
    const validationResult = this.validateCommand(command);
    if (!validationResult.isValid) {
      return {
        success: false,
        advice: this.getDefaultAdvice(command.mentorType),
        mentorType: command.mentorType,
        generatedAt: new Date(),
        isFallback: true,
        error: validationResult.error,
      };
    }

    // 도메인 서비스 호출
    const domainCommand: GenerateAdviceCommand = {
      mentorType: command.mentorType,
      recentTodos: command.recentTodos,
      weeklyRetrospects: command.weeklyRetrospects,
      overallGoal: command.overallGoal,
      intimacyLevel: command.intimacyLevel,
    };

    const result = await this.adviceDomainService.generateAdvice(domainCommand);

    // 결과 로깅
    this.logResult(command.userId, result);

    return {
      success: result.success,
      advice: result.advice,
      mentorType: command.mentorType,
      generatedAt: new Date(),
      isFallback: result.isFallback,
      error: result.error,
    };
  }

  private validateCommand(command: GenerateAdviceUseCaseCommand): {
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

  private getDefaultAdvice(mentorType: MentorType): string {
    return match(mentorType)
      .with(
        MentorType.팀쿡,
        () =>
          '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.',
      )
      .with(
        MentorType.공자,
        () =>
          '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.',
      )
      .with(
        MentorType.워렌버핏,
        () =>
          '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.',
      )
      .exhaustive();
  }

  private logResult(userId: string, result: AdviceResult): void {
    if (result.success) {
      this.logger.log(
        `Successfully generated advice for user ${userId}: ${result.advice.substring(0, 50)}...`,
      );
    } else {
      this.logger.warn(
        `Failed to generate advice for user ${userId}, using fallback. Error: ${result.error}`,
      );
    }
  }
}
