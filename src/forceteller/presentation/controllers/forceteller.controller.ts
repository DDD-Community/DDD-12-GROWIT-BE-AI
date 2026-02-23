import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ForcetellerService } from '../../application/services/forceteller.service';
import { SajuProfileDto } from '../dto/saju-profile.dto';
import { FourPillarsResult } from '../dto/saju-response.interface';

@Controller('forceteller')
export class ForcetellerController {
  private readonly logger = new Logger(ForcetellerController.name);

  constructor(private readonly forcetellerService: ForcetellerService) {}

  @Post('saju')
  async getSajuFourPillars(
    @Body() profile: SajuProfileDto,
  ): Promise<FourPillarsResult> {
    this.logger.log(`Received saju request for: ${profile.name}`);

    return this.forcetellerService.getSajuFourPillars(profile);
  }
}
