import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  SpringBatchRequest,
  SpringBatchResponse,
  SpringUserData,
} from '../common/interfaces';

@Injectable()
export class SpringClientService {
  private readonly logger = new Logger(SpringClientService.name);
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'SPRING_API_BASE_URL',
      'http://localhost:8080/api',
    );
    this.timeout = this.configService.get<number>('SPRING_API_TIMEOUT', 5000);
  }

  // nest dto => spring controller 정리 호출받을 수 있게 return(id) 값은 실행된 결과를 전달(기본 C,D)
  async getActiveUsers(): Promise<SpringUserData[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users/active`, {
          timeout: this.timeout,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        'Failed to get active users from Spring Boot:',
        error.message,
      );
      return [];
    }
  }

  async getUserData(userId: string): Promise<SpringUserData | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users/${userId}/ai-data`, {
          timeout: this.timeout,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get user data for ${userId}:`,
        error.message,
      );
      return null;
    }
  }

  async saveBatchAdvice(
    batchRequest: SpringBatchRequest,
  ): Promise<SpringBatchResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/advice/batch`, batchRequest, {
          timeout: this.timeout,
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to save batch advice:', error.message);
      return {
        success: false,
        processedUsers: 0,
        errors: [error.message],
      };
    }
  }

  async saveAdvice(
    userId: string,
    advice: string,
    mentorType: string,
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/advice`,
          {
            userId,
            advice,
            mentorType,
            generatedAt: new Date(),
          },
          {
            timeout: this.timeout,
          },
        ),
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to save advice for user ${userId}:`,
        error.message,
      );
      return false;
    }
  }

  async saveGoal(
    userId: string,
    weeklyGoal: string,
    mentorType: string,
  ): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/goals/weekly`,
          {
            userId,
            weeklyGoal,
            mentorType,
            generatedAt: new Date(),
          },
          {
            timeout: this.timeout,
          },
        ),
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to save weekly goal for user ${userId}:`,
        error.message,
      );
      return false;
    }
  }
}
