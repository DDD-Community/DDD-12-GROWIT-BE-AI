import { Injectable, Logger } from '@nestjs/common';
import { ValidationUtils } from '../../../common/utils/validation.utils';
import { OpenAIService } from './openai.service';
import { PromptTemplateService } from './prompt-template.service';

export interface TemplateGenerationCommand {
  userId: string;
  promptId: string;
  templateUid: string;
  input: Record<string, any>;
}

export interface TemplateGenerationResult<T> {
  success: boolean;
  entity: T | null;
  error?: string;
}

@Injectable()
export class TemplateBasedGeneratorService {
  private readonly logger = new Logger(TemplateBasedGeneratorService.name);

  constructor(
    private readonly promptTemplateService: PromptTemplateService,
    private readonly openaiService: OpenAIService,
  ) {}

  async generateWithTemplate<T>(
    command: TemplateGenerationCommand,
    entityFactory: (
      userId: string,
      promptId: string,
      mentorType: string,
      input: any,
    ) => T,
    updateOutput: (entity: T, output: string) => void,
  ): Promise<TemplateGenerationResult<T>> {
    try {
      this.logger.log(
        `Generating with template ${command.templateUid} for user ${command.userId}`,
      );

      const template = await this.promptTemplateService.getTemplateByUid(
        command.templateUid,
      );

      if (!template) {
        return {
          success: false,
          entity: null,
          error: `Template not found for uid: ${command.templateUid}`,
        };
      }

      const promptInfo =
        await this.promptTemplateService.getPromptInfoByPromptId(
          command.promptId,
        );

      if (!promptInfo) {
        return {
          success: false,
          entity: null,
          error: `Prompt template not found for promptId: ${command.promptId}`,
        };
      }

      if (!promptInfo.mentorType) {
        return {
          success: false,
          entity: null,
          error: `Cannot extract mentor type from promptId: ${command.promptId}`,
        };
      }

      const entity = entityFactory(
        command.userId,
        command.promptId,
        promptInfo.mentorType,
        command.input,
      );

      const prompt = this.buildPrompt(template, command.input);

      const generatedContent = await this.openaiService.generateAdvice(prompt);

      if (!ValidationUtils.isValidAdviceResponse(generatedContent)) {
        return {
          success: false,
          entity,
          error: 'Generated content does not meet validation requirements',
        };
      }

      updateOutput(entity, generatedContent);

      this.logger.log(
        `Successfully generated content with template for user ${command.userId}`,
      );

      return {
        success: true,
        entity,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate with template for user ${command.userId}: ${error.message}`,
      );

      return {
        success: false,
        entity: null,
        error: `Template generation failed: ${error.message}`,
      };
    }
  }

  private buildPrompt(template: any, input: Record<string, any>): string {
    let prompt = template.personaAndStyle || '';

    if (template.webSearchProtocol) {
      prompt += `\n\n${template.webSearchProtocol}`;
    }

    if (template.outputRules) {
      prompt += `\n\n${template.outputRules}`;
    }

    const inputText = Object.entries(input)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(', ') : value}`,
      )
      .join('\n');

    prompt += `\n\n사용자 정보:\n${inputText}`;

    if (template.insufficientContext) {
      prompt += `\n\n${template.insufficientContext}`;
    }

    return prompt;
  }
}
