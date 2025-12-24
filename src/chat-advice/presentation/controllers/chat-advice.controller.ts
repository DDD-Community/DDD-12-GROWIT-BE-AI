import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ChatAdviceService } from '../../application/services/chat-advice.service';
import { RealtimeAdviceRequestDto } from '../dto/realtime-advice-request.dto';
import { RealtimeAdviceResponseDto } from '../dto/realtime-advice-response.dto';

@Controller('advice')
export class ChatAdviceController {
  private readonly logger = new Logger(ChatAdviceController.name);

  constructor(private readonly chatAdviceService: ChatAdviceService) {}

  @Post('realtime')
  async generateRealtimeAdvice(
    @Body() request: RealtimeAdviceRequestDto,
  ): Promise<RealtimeAdviceResponseDto> {
    this.logger.log(
      `Received realtime advice request from user ${request.userId} with mode ${request.mode}`,
    );

    return await this.chatAdviceService.generateRealtimeAdvice(request);
  }
}
