import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  getForceTellerApiUrl
} from '../../config/forceteller.config';
import { SajuProfileDto } from '../presentation/dto/saju-profile.dto';
import { ForceTellerSajuResponse } from '../presentation/dto/saju-response.interface';

@Injectable()
export class ForcetellerApiClient {
  private readonly logger = new Logger(ForcetellerApiClient.name);
  private readonly apiUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiUrl = getForceTellerApiUrl();
  }

  async getSajuChart(
    profile: SajuProfileDto,
  ): Promise<ForceTellerSajuResponse> {
    this.logger.log(`Fetching saju chart for user: ${profile.name}`);

    const payload = {
      ...profile,
      gender: profile.gender === 'MALE' ? 'M' : 'F',
      locationId: 1835848, // Seoul
      locationName: 'Seoul',
    };

    const { data } = await firstValueFrom(
      this.httpService.post<ForceTellerSajuResponse>(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    return data;
  }
}
