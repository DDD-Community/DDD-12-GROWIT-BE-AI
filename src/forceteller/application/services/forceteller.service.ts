import { Injectable, Logger } from '@nestjs/common';
import { ForcetellerApiClient } from '../../infrastructure/forceteller-api.client';
import { SajuProfileDto } from '../../presentation/dto/saju-profile.dto';
import {
  ForceTellerSajuResponse,
  FourPillarsResult,
  Pillar,
} from '../../presentation/dto/saju-response.interface';

@Injectable()
export class ForcetellerService {
  private readonly logger = new Logger(ForcetellerService.name);

  constructor(private readonly apiClient: ForcetellerApiClient) {}

  async getSajuFourPillars(
    profile: SajuProfileDto,
  ): Promise<FourPillarsResult> {
    try {
      const response = await this.apiClient.getSajuChart(profile);
      return this.extractFourPillars(response);
    } catch (error) {
      this.logger.error('Failed to fetch saju chart', error);
      throw error;
    }
  }

  private extractFourPillars(
    response: ForceTellerSajuResponse,
  ): FourPillarsResult {
    const basicChart = response.data._기본명식;

    if (!basicChart) {
      throw new Error('Invalid response structure: _기본명식 is missing');
    }

    const formatPillar = (pillarData: Pillar): string => {
      const stem = pillarData._천간;
      const branch = pillarData._지지;
      return `${stem.name}${branch.name}(${stem.chinese}${branch.chinese})`;
    };

    return {
      year: formatPillar(basicChart._세차),
      month: formatPillar(basicChart._월건),
      day: formatPillar(basicChart._일진),
      hour: formatPillar(basicChart._시진),
    };
  }
}
