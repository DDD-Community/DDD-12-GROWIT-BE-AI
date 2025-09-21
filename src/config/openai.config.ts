import { ConfigService } from '@nestjs/config';

export const OPENAI_CONFIG = {
  model: 'gpt-4',
  maxTokens: 500,
  temperature: 0.7,
};

export const getOpenAIApiKey = (configService: ConfigService): string => {
  const apiKey = configService.get<string>('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not properly configured');
  }
  return apiKey;
};
