import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdviceGeneratorService } from '../ai/services/advice-generator.service';
import { SpringClientService } from '../external/spring-client.service';

@Injectable()
export class DailyAdviceScheduler {
  private readonly logger = new Logger(DailyAdviceScheduler.name);
  private readonly isSchedulerEnabled: boolean;

  constructor(
    private readonly springClientService: SpringClientService,
    private readonly adviceGeneratorService: AdviceGeneratorService,
    private readonly configService: ConfigService,
  ) {
    this.isSchedulerEnabled = this.configService.get<boolean>(
      'SCHEDULER_ENABLED',
      true,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    timeZone: 'Asia/Seoul',
  })
  async handleDailyUpdate() {
    if (!this.isSchedulerEnabled) {
      this.logger.log('Daily update scheduler is disabled');
      return;
    }

    try {
      this.logger.log('Starting daily advice generation...');

      const activeUsers = await this.springClientService.getActiveUsers();
      if (activeUsers.length === 0) {
        this.logger.log('No active users found for daily advice generation');
        return;
      }

      this.logger.log(
        `Processing daily advice for ${activeUsers.length} active users`,
      );

      let successCount = 0;
      const errors: string[] = [];

      for (const userData of activeUsers) {
        try {
          const advice = await this.adviceGeneratorService.generateAdvice(
            userData.mentorType,
            userData.recentTodos,
            userData.weeklyRetrospects,
            userData.intimacyLevel,
          );

          const saved = await this.springClientService.saveAdvice(
            userData.userId,
            advice,
            userData.mentorType,
          );

          if (saved) {
            successCount++;
            this.logger.debug(
              `Generated and saved advice for user ${userData.userId}`,
            );
          } else {
            const error = `Failed to save advice for user ${userData.userId}`;
            errors.push(error);
            this.logger.warn(error);
          }
        } catch (error) {
          const errorMessage = `Failed to process advice for user ${userData.userId}: ${error.message}`;
          errors.push(errorMessage);
          this.logger.error(errorMessage);
        }
      }

      this.logger.log(
        `Daily advice generation completed. Success: ${successCount}/${activeUsers.length}, Errors: ${errors.length}`,
      );

      if (errors.length > 0) {
        this.logger.error('Daily advice generation errors:', errors);
      }
    } catch (error) {
      this.logger.error('Daily advice generation failed:', error.message);
    }
  }

  async triggerManualUpdate(): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('Manual daily update triggered');
      await this.handleDailyUpdate();
      return { success: true, message: 'Manual update completed successfully' };
    } catch (error) {
      this.logger.error('Manual daily update failed:', error.message);
      return {
        success: false,
        message: `Manual update failed: ${error.message}`,
      };
    }
  }
}
