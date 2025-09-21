import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DailyAdviceScheduler {
  private readonly logger = new Logger(DailyAdviceScheduler.name);
  private readonly isSchedulerEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
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
      this.logger.log('Daily advice scheduler is running...');
      // TODO: Implement batch advice generation
      this.logger.log('Daily advice generation completed (placeholder)');
    } catch (error) {
      this.logger.error('Daily advice generation failed:', error.message);
    }
  }
}
