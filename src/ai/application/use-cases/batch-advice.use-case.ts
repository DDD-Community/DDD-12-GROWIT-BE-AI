import { Injectable, Logger } from '@nestjs/common';
import { SpringIntegrationRepository } from '../../domain/repositories/spring-integration.repository';
import {
  GenerateAdviceUseCase,
  GenerateAdviceUseCaseCommand,
} from './generate-advice.use-case';

export interface BatchAdviceResult {
  userId: string;
  success: boolean;
  advice?: string;
  error?: string;
  executionTime: number;
}

export interface BatchAdviceUseCaseResult {
  totalUsers: number;
  successCount: number;
  failureCount: number;
  results: BatchAdviceResult[];
  totalExecutionTime: number;
  averageExecutionTime: number;
}

@Injectable()
export class BatchAdviceUseCase {
  private readonly logger = new Logger(BatchAdviceUseCase.name);

  constructor(
    private readonly springIntegrationRepository: SpringIntegrationRepository,
    private readonly generateAdviceUseCase: GenerateAdviceUseCase,
  ) {}

  async executeForActiveUsers(): Promise<BatchAdviceUseCaseResult> {
    const startTime = Date.now();
    this.logger.log('Starting batch advice generation for active users...');

    try {
      // 1. 활성 사용자 조회
      const activeUsers =
        await this.springIntegrationRepository.getActiveUsers();

      if (activeUsers.length === 0) {
        this.logger.warn('No active users found for batch processing');
        return {
          totalUsers: 0,
          successCount: 0,
          failureCount: 0,
          results: [],
          totalExecutionTime: Date.now() - startTime,
          averageExecutionTime: 0,
        };
      }

      this.logger.log(
        `Processing batch advice for ${activeUsers.length} users`,
      );

      // 2. 각 사용자별로 조언 생성 (병렬 처리)
      const results = await this.processBatchAdvice(activeUsers);

      // 3. 통계 계산
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;
      const totalExecutionTime = Date.now() - startTime;
      const averageExecutionTime =
        results.reduce((acc, r) => acc + r.executionTime, 0) / results.length;

      this.logger.log(
        `Batch advice generation completed. Success: ${successCount}/${results.length}, ` +
          `Total time: ${totalExecutionTime}ms, Average time: ${averageExecutionTime.toFixed(2)}ms per user`,
      );

      return {
        totalUsers: activeUsers.length,
        successCount,
        failureCount,
        results,
        totalExecutionTime,
        averageExecutionTime,
      };
    } catch (error) {
      this.logger.error('Batch advice generation failed:', error.message);
      throw error;
    }
  }

  private async processBatchAdvice(
    activeUsers: any[],
  ): Promise<BatchAdviceResult[]> {
    // 병렬 처리로 성능 향상
    const promises = activeUsers.map((userData) =>
      this.processUserAdvice(userData),
    );

    return Promise.all(promises);
  }

  private async processUserAdvice(userData: any): Promise<BatchAdviceResult> {
    const startTime = Date.now();

    try {
      // 조언 생성
      const command: GenerateAdviceUseCaseCommand = {
        mentorType: userData.mentorType,
        userId: userData.userId,
        recentTodos: userData.recentTodos || [],
        weeklyRetrospects: userData.weeklyRetrospects || [],
        overallGoal: userData.overallGoal || '',
        intimacyLevel: userData.intimacyLevel,
      };

      const result = await this.generateAdviceUseCase.execute(command);

      // Spring Boot에 저장
      if (result.success) {
        const saved = await this.springIntegrationRepository.saveAdvice(
          userData.userId,
          result.advice,
          userData.mentorType,
        );

        if (!saved) {
          return {
            userId: userData.userId,
            success: false,
            error: 'Failed to save advice to Spring Boot',
            executionTime: Date.now() - startTime,
          };
        }
      }

      return {
        userId: userData.userId,
        success: result.success,
        advice: result.advice,
        error: result.error,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      this.logger.error(
        `Failed to process advice for user ${userData.userId}:`,
        error.message,
      );

      return {
        userId: userData.userId,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }
}
