import { Controller, Post, Get, Logger, Query } from '@nestjs/common';
import { match } from 'ts-pattern';
import { MentorType, IntimacyLevel } from '../../common/enums';
import { BatchAdviceUseCase } from '../application/use-cases/batch-advice.use-case';
import {
  GenerateAdviceUseCase,
  GenerateAdviceUseCaseCommand,
} from '../application/use-cases/generate-advice.use-case';
import { DailyAdviceScheduler } from '../../schedulers/daily-advice.scheduler';

interface TestUserData {
  userId: string;
  mentorType: MentorType;
  intimacyLevel: IntimacyLevel;
  recentTodos: string[];
  weeklyRetrospects: string[];
  overallGoal: string;
}

@Controller('test')
export class TestController {
  private readonly logger = new Logger(TestController.name);

  constructor(
    private readonly batchAdviceUseCase: BatchAdviceUseCase,
    private readonly generateAdviceUseCase: GenerateAdviceUseCase,
    private readonly dailyAdviceScheduler: DailyAdviceScheduler,
  ) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'OK',
      timestamp: new Date(),
      service: 'Growit AI Service',
      version: '1.0.0',
    };
  }

  @Post('batch/run')
  async testBatchAdvice() {
    this.logger.log('Manual batch advice test triggered');

    try {
      const result = await this.batchAdviceUseCase.executeForActiveUsers();

      return {
        success: true,
        message: 'Batch advice generation completed',
        statistics: {
          totalUsers: result.totalUsers,
          successCount: result.successCount,
          failureCount: result.failureCount,
          successRate:
            result.totalUsers > 0
              ? ((result.successCount / result.totalUsers) * 100).toFixed(2) +
                '%'
              : '0%',
          totalExecutionTime: result.totalExecutionTime + 'ms',
          averageExecutionTime: result.averageExecutionTime.toFixed(2) + 'ms',
        },
        results: result.results,
      };
    } catch (error) {
      this.logger.error('Test batch advice failed:', error.message);
      return {
        success: false,
        message: 'Batch advice generation failed',
        error: error.message,
      };
    }
  }

  @Post('scheduler/trigger')
  async testScheduler() {
    this.logger.log('Manual scheduler test triggered');

    try {
      const result = await this.dailyAdviceScheduler.triggerManualUpdate();

      return {
        success: result.success,
        message: result.message,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Test scheduler failed:', error.message);
      return {
        success: false,
        message: 'Scheduler test failed',
        error: error.message,
      };
    }
  }

  @Post('advice/single')
  async testSingleAdvice(
    @Query('mentor') mentorQuery: string = '팀쿡',
    @Query('intimacy') intimacyQuery: string = 'MEDIUM',
  ) {
    this.logger.log(
      `Testing single advice generation for mentor: ${mentorQuery}, intimacy: ${intimacyQuery}`,
    );

    // 입력 검증 및 변환
    const mentorType = this.validateMentorType(mentorQuery);
    const intimacyLevel = this.validateIntimacyLevel(intimacyQuery);

    if (!mentorType || !intimacyLevel) {
      return {
        success: false,
        message: 'Invalid parameters',
        error: `Valid mentors: ${Object.values(MentorType).join(', ')}. Valid intimacy levels: ${Object.values(IntimacyLevel).join(', ')}`,
      };
    }

    try {
      // 테스트 데이터 생성
      const testData = this.generateTestData(mentorType, intimacyLevel);

      const command: GenerateAdviceUseCaseCommand = {
        mentorType: testData.mentorType,
        userId: testData.userId,
        recentTodos: testData.recentTodos,
        weeklyRetrospects: testData.weeklyRetrospects,
        overallGoal: testData.overallGoal,
        intimacyLevel: testData.intimacyLevel,
      };

      const startTime = Date.now();
      const result = await this.generateAdviceUseCase.execute(command);
      const executionTime = Date.now() - startTime;

      return {
        success: result.success,
        advice: result.advice,
        mentorType: result.mentorType,
        intimacyLevel: testData.intimacyLevel,
        isFallback: result.isFallback,
        executionTime: executionTime + 'ms',
        testData: {
          recentTodos: testData.recentTodos,
          weeklyRetrospects: testData.weeklyRetrospects,
        },
        error: result.error,
      };
    } catch (error) {
      this.logger.error('Test single advice failed:', error.message);
      return {
        success: false,
        message: 'Single advice test failed',
        error: error.message,
      };
    }
  }

  @Get('mentors/all')
  getAllMentorInfo() {
    return {
      mentors: Object.values(MentorType).map((type) => ({
        type,
        name: type,
        description: this.getMentorDescription(type),
      })),
      intimacyLevels: Object.values(IntimacyLevel).map((level) => ({
        level,
        description: this.getIntimacyDescription(level),
      })),
    };
  }

  private validateMentorType(mentorQuery: string): MentorType | null {
    const mentorType = Object.values(MentorType).find(
      (type) =>
        type === mentorQuery ||
        type.toLowerCase() === mentorQuery.toLowerCase(),
    );
    return mentorType || null;
  }

  private validateIntimacyLevel(intimacyQuery: string): IntimacyLevel | null {
    const intimacyLevel = Object.values(IntimacyLevel).find(
      (level) =>
        level === intimacyQuery ||
        level.toLowerCase() === intimacyQuery.toLowerCase(),
    );
    return intimacyLevel || null;
  }

  private generateTestData(
    mentorType: MentorType,
    intimacyLevel: IntimacyLevel,
  ): TestUserData {
    const baseTestData = {
      userId: `test-user-${Date.now()}`,
      mentorType,
      intimacyLevel,
    };

    return match(mentorType)
      .with(MentorType.팀쿡, () => ({
        ...baseTestData,
        recentTodos: [
          '프론트엔드 개발 완료하기',
          'API 연동 테스트',
          '배포 환경 설정',
          '코드 리뷰 반영',
        ],
        weeklyRetrospects: [
          '이번 주는 프로젝트 진행에 집중했다. 예상보다 시간이 많이 걸렸지만 완성도는 높아졌다.',
          '팀원들과의 협업이 원활했고, 새로운 기술 스택을 익힐 수 있었다.',
        ],
        overallGoal: '성공적인 스타트업 창업하기',
      }))
      .with(MentorType.공자, () => ({
        ...baseTestData,
        recentTodos: [
          '알고리즘 문제 10개 풀기',
          'CS 기초 개념 정리',
          '영어 단어 100개 암기',
          '독서 30분',
        ],
        weeklyRetrospects: [
          '꾸준히 학습하는 습관을 만들어가고 있다. 매일 조금씩이라도 진전이 있었다.',
          '어려운 개념도 반복 학습을 통해 이해할 수 있었다. 인내심의 중요성을 깨달았다.',
        ],
        overallGoal: '대기업 개발자 취업하기',
      }))
      .with(MentorType.워렌버핏, () => ({
        ...baseTestData,
        recentTodos: [
          '주식 공부 1시간',
          '투자 포트폴리오 점검',
          '경제 뉴스 읽기',
          '가계부 정리',
        ],
        weeklyRetrospects: [
          '장기 투자 관점에서 포트폴리오를 재조정했다. 단기 변동에 흔들리지 않으려 노력했다.',
          '다양한 투자 서적을 읽으며 투자 철학을 다지고 있다. 인내와 원칙이 중요하다는 걸 깨달았다.',
        ],
        overallGoal: '장기투자로 경제적 자유 달성하기',
      }))
      .exhaustive();
  }

  private getMentorDescription(mentorType: MentorType): string {
    return match(mentorType)
      .with(
        MentorType.팀쿡,
        () => '사이드 프로젝트 멘토 - 꼼꼼한 전략가, 실행력 중심',
      )
      .with(
        MentorType.공자,
        () => '스터디 멘토 - 온화하지만 원칙적, 학습과 인내 중심',
      )
      .with(
        MentorType.워렌버핏,
        () => '재테크 멘토 - 유머러스하며 검소, 장기 투자 중심',
      )
      .exhaustive();
  }

  private getIntimacyDescription(intimacyLevel: IntimacyLevel): string {
    return match(intimacyLevel)
      .with(IntimacyLevel.HIGH, () => '높은 친밀도 - 구체적이고 도전적인 조언')
      .with(IntimacyLevel.MEDIUM, () => '중간 친밀도 - 표준 조언')
      .with(IntimacyLevel.LOW, () => '낮은 친밀도 - 기본적이고 격려 위주 조언')
      .exhaustive();
  }
}
