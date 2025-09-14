import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SpringIntegrationRepository } from '../domain/repositories/spring-integration.repository';
import { SpringUserData } from '../../common/interfaces';

@Injectable()
export class SpringIntegrationRepositoryImpl extends SpringIntegrationRepository {
  private readonly logger = new Logger(SpringIntegrationRepositoryImpl.name);
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.baseUrl = this.configService.get<string>(
      'SPRING_API_BASE_URL',
      'http://localhost:8080/api',
    );
    this.timeout = this.configService.get<number>('SPRING_API_TIMEOUT', 5000);
  }

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
