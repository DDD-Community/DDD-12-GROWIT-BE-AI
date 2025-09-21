import { Injectable, Logger } from '@nestjs/common';
import { SpringUserData } from '../../common/interfaces';
import { SpringIntegrationRepository } from '../domain/repositories/spring-integration.repository';
import { MentorType } from '../domain/value-objects/mentor-type.vo';

@Injectable()
export class MockSpringRepository extends SpringIntegrationRepository {
  private readonly logger = new Logger(MockSpringRepository.name);

  constructor() {
    super();
  }

  async getActiveUsers(): Promise<SpringUserData[]> {
    this.logger.log('Returning mock active users for testing');

    // 다양한 시나리오의 테스트 사용자 생성
    return [
      {
        userId: 'user-001-timcook',
        mentorType: MentorType['피터 레벨스'],
        recentTodos: [
          '프론트엔드 개발 완료',
          'API 연동 테스트',
          '배포 환경 설정',
          '성능 최적화 작업',
        ],
        weeklyRetrospects: [
          '이번 주는 프로젝트 개발에 집중했다. 새로운 기술 스택을 도입해서 처음엔 어려웠지만 결과가 좋았다.',
          '팀원들과의 협업이 매우 원활했고, 코드 리뷰를 통해 많이 배웠다.',
        ],
        overallGoal: '사이드 프로젝트 성공적으로 런칭하기',
      },
      {
        userId: 'user-002-confucius',
        mentorType: MentorType['젠슨 황'],
        recentTodos: [
          '알고리즘 문제 10개 풀기',
          'CS 기초 개념 정리',
          '영어 공부 30분',
          '독서 1시간',
        ],
        weeklyRetrospects: [
          '꾸준히 학습하는 습관을 기르고 있다. 매일 조금씩이라도 성장하고 있다는 느낌이 든다.',
        ],
        overallGoal: '개발자로 취업하기',
      },
      {
        userId: 'user-003-warren',
        mentorType: MentorType.워렌버핏,
        recentTodos: ['주식 공부', '투자 서적 읽기'],
        weeklyRetrospects: ['투자에 대해 공부하기 시작했다.'],
        overallGoal: '재정 독립 달성하기',
      },
      {
        userId: 'user-004-empty-data',
        mentorType: MentorType['피터 레벨스'],
        recentTodos: [],
        weeklyRetrospects: [],
        overallGoal: '새로운 도전 시작하기',
      },
      {
        userId: 'user-005-high-intimacy',
        mentorType: MentorType['젠슨 황'],
        recentTodos: [
          '알고리즘 고급 문제 해결',
          '오픈소스 프로젝트 기여',
          '기술 블로그 포스팅',
          '스터디 그룹 리딩',
          '신입 개발자 멘토링',
        ],
        weeklyRetrospects: [
          '이번 주는 정말 많은 것을 배웠다. 어려운 알고리즘 문제를 해결하면서 성장했다.',
          '다른 사람들을 가르치면서 내 지식도 더 확고해졌다. 나눔의 가치를 깨달았다.',
          '오픈소스 기여를 통해 실무 경험을 쌓았고, 글로벌 개발자들과 소통할 수 있었다.',
        ],
        overallGoal: '시니어 개발자로 성장하고 후배들을 이끌어가기',
      },
    ];
  }

  async getUserData(userId: string): Promise<SpringUserData | null> {
    this.logger.log(`Getting mock user data for: ${userId}`);

    const users = await this.getActiveUsers();
    return users.find((user) => user.userId === userId) || null;
  }

  async saveAdvice(
    userId: string,
    advice: string,
    mentorType: string,
  ): Promise<boolean> {
    this.logger.log(
      `Mock saving advice for user ${userId} (${mentorType}): ${advice.substring(0, 50)}...`,
    );

    // 10% 확률로 실패 시뮬레이션 (실제 네트워크 환경 시뮬레이션)
    if (Math.random() < 0.1) {
      this.logger.warn(`Mock save failed for user ${userId}`);
      return false;
    }

    // 실제 저장 시뮬레이션 (약간의 지연)
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 100 + 50),
    );

    return true;
  }

  async saveGoal(
    userId: string,
    weeklyGoal: string,
    mentorType: string,
  ): Promise<boolean> {
    this.logger.log(
      `Mock saving goal for user ${userId} (${mentorType}): ${weeklyGoal}`,
    );

    // 5% 확률로 실패 시뮬레이션
    if (Math.random() < 0.05) {
      this.logger.warn(`Mock goal save failed for user ${userId}`);
      return false;
    }

    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 50 + 25),
    );

    return true;
  }
}
