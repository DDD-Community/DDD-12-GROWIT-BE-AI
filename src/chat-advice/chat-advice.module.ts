import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ChatAdvicePromptService } from './application/services/chat-advice-prompt.service';
import { ChatAdviceService } from './application/services/chat-advice.service';
import { ChatAdviceController } from './presentation/controllers/chat-advice.controller';

@Module({
  imports: [AiModule],
  controllers: [ChatAdviceController],
  providers: [ChatAdvicePromptService, ChatAdviceService],
  exports: [ChatAdviceService],
})
export class ChatAdviceModule {}
