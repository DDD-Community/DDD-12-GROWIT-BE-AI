import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BatchAdviceUseCase } from '../ai/application/use-cases/batch-advice.use-case';

@Injectable()
export class DailyAdviceScheduler {
  private readonly logger = new Logger(DailyAdviceScheduler.name);
  private readonly isSchedulerEnabled: boolean;

  constructor(
    private readonly batchAdviceUseCase: BatchAdviceUseCase,
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

      const result = await this.batchAdviceUseCase.executeForActiveUsers();

      this.logger.log(
        `Daily advice generation completed. Success: ${result.successCount}/${result.totalUsers}, ` +
          `Failures: ${result.failureCount}, Total time: ${result.totalExecutionTime}ms`,
      );

      if (result.failureCount > 0) {
        const errors = result.results
          .filter((r) => !r.success)
          .map((r) => `User ${r.userId}: ${r.error}`);
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
