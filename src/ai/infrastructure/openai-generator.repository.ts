import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AIGeneratorRepository } from '../domain/repositories/ai-generator.repository';
import { OPENAI_CONFIG, getOpenAIApiKey } from '../../config/openai.config';

@Injectable()
export class OpenAIGeneratorRepository extends AIGeneratorRepository {
  private readonly logger = new Logger(OpenAIGeneratorRepository.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    super();
    const apiKey = getOpenAIApiKey(configService);
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateAdvice(prompt: string): Promise<string> {
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

      return content;
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
        max_tokens: 50,
        temperature: OPENAI_CONFIG.temperature,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('OpenAI response is empty');
      }

      return content;
    } catch (error) {
      this.logger.error('Failed to generate goal:', error.message);
      throw error;
    }
  }
}
