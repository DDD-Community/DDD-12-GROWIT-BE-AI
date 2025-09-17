import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CreatePromptTemplateUseCase } from '../application/use-cases/create-prompt-template.use-case';
import {
  CreatePromptTemplateRequestDto,
  DeletePromptTemplateResponseDto,
  ListPromptTemplatesResponseDto,
  PromptTemplateResponseDto,
} from '../dto/prompt-template.dto';
import { PromptTemplateService } from '../services/prompt-template.service';

@Controller('ai')
export class PromptTemplateController {
  private readonly logger = new Logger(PromptTemplateController.name);

  constructor(
    private readonly promptTemplateService: PromptTemplateService,
    private readonly createPromptTemplateUseCase: CreatePromptTemplateUseCase,
  ) {}

  @Post('prompt-templates')
  async createPromptTemplate(
    @Body() request: CreatePromptTemplateRequestDto,
  ): Promise<{ success: boolean; id: string }> {
    return await this.createPromptTemplateUseCase.execute(request);
  }

  @Get('prompt-templates/:uid')
  async getPromptTemplate(
    @Param('uid') uid: string,
  ): Promise<PromptTemplateResponseDto> {
    this.logger.log('Getting prompt template:', uid);

    const template = await this.promptTemplateService.getTemplate(uid);
    if (!template) {
      throw new Error(`Prompt template with UID ${uid} not found`);
    }

    return template;
  }

  @Get('prompt-templates')
  async listPromptTemplates(): Promise<ListPromptTemplatesResponseDto> {
    this.logger.log('Listing all prompt templates');

    const templates = await this.promptTemplateService.getAllTemplates();

    return {
      success: true,
      promptTemplates: templates,
    };
  }

  @Delete('prompt-templates/:uid')
  async deletePromptTemplate(
    @Param('uid') uid: string,
  ): Promise<DeletePromptTemplateResponseDto> {
    this.logger.log('Deleting prompt template:', uid);

    const existingTemplate = await this.promptTemplateService.getTemplate(uid);
    if (!existingTemplate) {
      throw new Error(`Prompt template with UID ${uid} not found`);
    }

    const deleted = await this.promptTemplateService.deleteTemplate(uid);
    if (!deleted) {
      throw new Error(`Failed to delete prompt template with UID ${uid}`);
    }

    return {
      success: true,
      message: `Prompt template '${existingTemplate.name}' has been successfully deleted`,
    };
  }
}
