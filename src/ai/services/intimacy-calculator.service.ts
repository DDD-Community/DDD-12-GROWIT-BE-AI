import { Injectable, Logger } from '@nestjs/common';
import { IntimacyLevel, INTIMACY_CRITERIA } from '../../common/enums';

export interface IntimacyCalculationData {
  totalTodos: number;
  weeklyRetrospects: number;
}

export interface IntimacyInfo {
  level: IntimacyLevel;
  description: string;
  criteria: {
    minTodos: number;
    minReviews: number;
  };
}

@Injectable()
export class IntimacyCalculatorService {
  private readonly logger = new Logger(IntimacyCalculatorService.name);
  /**
   * 사용자 데이터를 기반으로 친밀도 레벨을 계산합니다.
   */
  async calculateIntimacyLevel(data: IntimacyCalculationData): Promise<IntimacyLevel> {
    try {
      this.logger.log(
        `친밀도 레벨을 계산합니다. ${data.totalTodos} 투두와 ${data.weeklyRetrospects} 회고`
      );

      const intimacyLevel = this.determineIntimacyLevel(data);
      
      this.logger.log(
        `계산된 친밀도 레벨: ${intimacyLevel} (${INTIMACY_CRITERIA[intimacyLevel].description})`
      );
      return intimacyLevel;
    } catch (error) {
      this.logger.error('Failed to calculate intimacy level:', error.message);
      // 기본값으로 MEDIUM 반환
      return IntimacyLevel.MEDIUM;
    }
  }

  /**
   * 투두 개수와 회고 개수를 기반으로 친밀도 레벨을 결정합니다.
   */
  private determineIntimacyLevel(data: IntimacyCalculationData): IntimacyLevel {
    const { totalTodos, weeklyRetrospects } = data;

    // HIGH 레벨 조건 
    if (
      totalTodos >= INTIMACY_CRITERIA[IntimacyLevel.HIGH].minTodos &&
      weeklyRetrospects >= INTIMACY_CRITERIA[IntimacyLevel.HIGH].minReviews
    ) {
      return IntimacyLevel.HIGH;
    }
    // LOW 레벨 조건 
    if (
      totalTodos <= INTIMACY_CRITERIA[IntimacyLevel.LOW].minTodos &&
      weeklyRetrospects <= INTIMACY_CRITERIA[IntimacyLevel.LOW].minReviews
    ) {
      return IntimacyLevel.LOW;
    }
    // 나머지는 MEDIUM 레벨
    return IntimacyLevel.MEDIUM;
  }

  /**
   * 친밀도 레벨에 대한 상세 정보를 반환합니다.
   */
  getIntimacyInfo(level: IntimacyLevel): IntimacyInfo {
    return {
      level,
      description: INTIMACY_CRITERIA[level].description,
      criteria: {
        minTodos: INTIMACY_CRITERIA[level].minTodos,
        minReviews: INTIMACY_CRITERIA[level].minReviews,
      },
    };
  }
}