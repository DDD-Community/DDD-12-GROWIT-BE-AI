import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SajuProfileDto } from '../../presentation/dto/saju-profile.dto';
import {
  ForceTellerSajuResponse,
  FourPillarsResult,
} from '../../presentation/dto/saju-response.interface';

@Injectable()
export class ForcetellerService {
  private readonly logger = new Logger(ForcetellerService.name);
  private readonly API_URL =
    'https://api.forceteller.com/api/pro/profile/saju/chart';

  constructor(private readonly httpService: HttpService) {}

  async getSajuChart(
    profile: SajuProfileDto,
  ): Promise<ForceTellerSajuResponse> {
    try {
      this.logger.log(`Fetching saju chart for user: ${profile.name}`);
      const payload = {
        ...profile,
        locationId: 1835848, // Seoul
        locationName: 'Seoul',
      };

      const { data } = await firstValueFrom(
        this.httpService.post<ForceTellerSajuResponse>(this.API_URL, payload),
      );
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch saju chart', error);
      throw error;
    }
  }

  extractFourPillars(response: ForceTellerSajuResponse): FourPillarsResult {
    const basicChart = response.data._기본명식;

    if (!basicChart) {
      throw new Error('Invalid response structure: _기본명식 is missing');
    }

    const formatPillar = (pillarData: any): string => {
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
