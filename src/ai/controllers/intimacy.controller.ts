import { Controller, Logger, Get, Headers } from '@nestjs/common';
import { IntimacyCalculatorService } from '../services/intimacy-calculator.service';
import { SpringClientService } from '../../external/spring-client.service';
import {
  GetIntimacyResponseDto,
} from '../dto/intimacy.dto';
import { IntimacyLevel } from '../../common/enums';

@Controller('ai/intimacy')
export class IntimacyController {
  private readonly logger = new Logger(IntimacyController.name);

  constructor(
    private readonly intimacyCalculatorService: IntimacyCalculatorService,
    private readonly springClientService: SpringClientService,
  ) {}

  @Get('mentor/intimacy')
  async getIntimacy(
    @Headers('authorization') authorization: string,
  ): Promise<GetIntimacyResponseDto> {
    try {
      // Authorization 헤더에서 토큰 추출
      if (!authorization || !authorization.startsWith('Bearer ')) {
        this.logger.error('Invalid or missing Authorization header');
        return {
          success: false,
          intimacyLevel: IntimacyLevel.MEDIUM,
          description: '기본 상태 (디폴트)',
          calculatedAt: new Date(),
          error: 'Invalid or missing Authorization header',
        };
      }

      const accessToken = authorization.substring(7); // "Bearer " 제거?
      
      this.logger.log(`토큰을 통해 사용자 정보를 조회합니다`);

      // 이 메소드가 Spring API에서 토큰을 통해 사용자 정보 조회하는걸로 이해했습니다
      const userData = await this.springClientService.getUserData(accessToken);
      
      if (!userData) {
        this.logger.error('사용자 정보를 조회할 수 없습니다');
        return {
          success: false,
          intimacyLevel: IntimacyLevel.MEDIUM,
          description: '기본 상태 (디폴트)',
          calculatedAt: new Date(),
          error: '사용자 정보를 조회할 수 없습니다',
        };
      }

      // 친밀도 레벨 계산
      const intimacyLevel = await this.intimacyCalculatorService.calculateIntimacyLevel({
        totalTodos: userData.recentTodos.length,
        weeklyRetrospects: userData.weeklyRetrospects.length,
      });

      const intimacyInfo = this.intimacyCalculatorService.getIntimacyInfo(intimacyLevel);

      this.logger.log(
        `사용자 ${userData.userId}의 친밀도 레벨: ${intimacyLevel} (${intimacyInfo.description})`
      );

      return {
        success: true,
        intimacyLevel,
        description: intimacyInfo.description,
        calculatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `친밀도 조회 실패:`,
        error.message,
      );

      return {
        success: false,
        intimacyLevel: IntimacyLevel.MEDIUM,
        description: '기본 상태 (디폴트)',
        calculatedAt: new Date(),
        error: error.message,
      };
    }
  }
}
