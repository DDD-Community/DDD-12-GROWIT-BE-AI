import { RealtimeAdviceRequestDto } from '@/chat-advice/presentation/dto/realtime-advice-request.dto';
import { RealtimeAdviceResponseDto } from '@/chat-advice/presentation/dto/realtime-advice-response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { match } from 'ts-pattern';
import { OpenAIService } from '../../../ai/application/services/openai.service';
import { RetryUtils } from '../../../common/utils';
import { ChatAdvicePromptService } from './chat-advice-prompt.service';

@Injectable()
export class ChatAdviceService {
  private readonly logger = new Logger(ChatAdviceService.name);

  constructor(
    private readonly promptService: ChatAdvicePromptService,
    private readonly openaiService: OpenAIService,
  ) {}

  async generateRealtimeAdvice(
    request: RealtimeAdviceRequestDto,
  ): Promise<RealtimeAdviceResponseDto> {
    this.logger.log(
      `Generating ${request.mode} advice for user ${request.userId}, goal ${request.goalId}`,
    );

    // Generate prompt based on onboarding status or mode
    const prompt = match(request.isGoalOnboardingCompleted)
      .with(false, () =>
        this.promptService.generateOnboardingPrompt(
          request.goalTitle,
          request.concern,
        ),
      )
      .otherwise(() =>
        this.promptService.generateRealtimeAdvicePrompt(
          request.goalTitle,
          request.concern,
          request.mode,
          request.recentTodos,
        ),
      );

    // Call OpenAI with retry logic
    const advice = await RetryUtils.retry(
      async () => {
        const response = await this.openaiService.createChatCompletion(
          [{ role: 'user', content: prompt }],
          {
            temperature: 0.7,
            max_tokens: 500,
          },
        );

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('OpenAI response is empty');
        }

        return content.trim();
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        exponentialBackoff: true,
        onRetry: (error, attempt) => {
          this.logger.warn(
            `Chat advice generation retry (attempt ${attempt}): ${error.message}`,
          );
        },
      },
    );

    this.logger.log(
      `Generated advice for user ${request.userId}: ${advice.substring(0, 50)}...`,
    );

    return {
      advice,
      mode: request.mode,
    };
  }
}
