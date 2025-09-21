import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ValidationUtils } from '../../../common/utils';
import { OPENAI_CONFIG, getOpenAIApiKey } from '../../../config/openai.config';
import { StructuredAdviceResponseDto } from '../../dto';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = getOpenAIApiKey(configService);
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateAdvice(prompt: string): Promise<StructuredAdviceResponseDto> {
    try {
      this.logger.debug(
        `Generating advice with prompt: ${prompt.substring(0, 100)}...`,
      );

      const response = await this.openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: OPENAI_CONFIG.temperature,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI response is empty');
      }

      const sanitized = ValidationUtils.sanitizeResponse(content);

      if (!ValidationUtils.isValidStructuredAdviceResponse(sanitized)) {
        this.logger.warn(
          `Invalid structured advice response format: ${sanitized}`,
        );
        throw new Error(
          'Generated advice does not meet structured format requirements',
        );
      }

      const parsedResponse =
        ValidationUtils.parseStructuredAdviceResponse(sanitized);
      if (!parsedResponse) {
        throw new Error('Failed to parse structured advice response');
      }

      return parsedResponse;
    } catch (error) {
      this.logger.error('Failed to generate advice:', error.message);
      throw error;
    }
  }

  async generateGoal(prompt: string): Promise<string> {
    try {
      this.logger.debug(
        `Generating goal with prompt: ${prompt.substring(0, 100)}...`,
      );

      const response = await this.openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: OPENAI_CONFIG.temperature,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI response is empty');
      }

      const sanitized = ValidationUtils.sanitizeResponse(content);

      if (!ValidationUtils.isValidGoalResponse(sanitized)) {
        this.logger.warn(`Invalid goal response format: ${sanitized}`);
        throw new Error('Generated goal does not meet format requirements');
      }

      return sanitized;
    } catch (error) {
      this.logger.error('Failed to generate goal:', error.message);
      throw error;
    }
  }
}
