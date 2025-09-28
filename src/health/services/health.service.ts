import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super();
  }

  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.dataSource.query('SELECT 1');
      return this.getStatus('database', true, {
        message: 'Database is healthy',
      });
    } catch (error) {
      throw new HealthCheckError(
        'Database check failed',
        this.getStatus('database', false, { error: error.message }),
      );
    }
  }

  async checkOpenAI(): Promise<HealthIndicatorResult> {
    try {
      const openaiApiKey = this.configService.get('OPENAI_API_KEY');
      if (!openaiApiKey) {
        throw new HealthCheckError(
          'OpenAI API key not configured',
          this.getStatus('openai', false, { error: 'API key not found' }),
        );
      }

      return this.getStatus('openai', true, {
        message: 'OpenAI configuration is healthy',
      });
    } catch (error) {
      throw new HealthCheckError(
        'OpenAI check failed',
        this.getStatus('openai', false, { error: error.message }),
      );
    }
  }

  async checkMemory(): Promise<HealthIndicatorResult> {
    try {
      const memUsage = process.memoryUsage();
      const totalMemory = memUsage.heapTotal;
      const usedMemory = memUsage.heapUsed;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      if (memoryUsagePercent > 90) {
        throw new HealthCheckError(
          'High memory usage',
          this.getStatus('memory', false, {
            usage: `${memoryUsagePercent.toFixed(2)}%`,
            used: `${Math.round(usedMemory / 1024 / 1024)}MB`,
            total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
          }),
        );
      }

      return this.getStatus('memory', true, {
        usage: `${memoryUsagePercent.toFixed(2)}%`,
        used: `${Math.round(usedMemory / 1024 / 1024)}MB`,
        total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
      });
    } catch (error) {
      throw new HealthCheckError(
        'Memory check failed',
        this.getStatus('memory', false, { error: error.message }),
      );
    }
  }
}
