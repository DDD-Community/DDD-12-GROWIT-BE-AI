import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import {
  CreatePromptTemplateRequestDto,
  DeletePromptTemplateResponseDto,
  ListPromptTemplatesResponseDto,
  PromptTemplateResponseDto,
  UpdatePromptTemplateRequestDto,
} from '../dto/prompt-template.dto';
import { PromptTemplateService } from '../services/prompt-template.service';

@Controller('ai')
export class PromptTemplateController {
  private readonly logger = new Logger(PromptTemplateController.name);

  constructor(private readonly promptTemplateService: PromptTemplateService) {}

  @Post('prompt-templates')
  async createPromptTemplate(
    @Body() request: CreatePromptTemplateRequestDto,
  ): Promise<PromptTemplateResponseDto> {
    this.logger.log('Creating new prompt template:', request.name);

    const promptId = nanoid();
    const now = new Date();

    const template = {
      id: nanoid(),
      promptId,
      name: request.name,
      prompt: request.prompt,
      createdAt: now,
      updatedAt: now,
    };
    this.promptTemplateService.saveTemplate(template);

    return template;
  }

  @Get('prompt-templates/:promptId')
  async getPromptTemplate(
    @Param('promptId') promptId: string,
  ): Promise<PromptTemplateResponseDto> {
    this.logger.log('Getting prompt template:', promptId);

    const template = this.promptTemplateService.getTemplate(promptId);
    if (!template) {
      throw new Error(`Prompt template with ID ${promptId} not found`);
    }

    return template;
  }

  @Get('prompt-templates')
  async listPromptTemplates(): Promise<ListPromptTemplatesResponseDto> {
    this.logger.log('Listing all prompt templates');

    const templates = this.promptTemplateService.getAllTemplates();

    return {
      success: true,
      promptTemplates: templates,
    };
  }

  @Put('prompt-templates/:promptId')
  async updatePromptTemplate(
    @Param('promptId') promptId: string,
    @Body() request: UpdatePromptTemplateRequestDto,
  ): Promise<PromptTemplateResponseDto> {
    this.logger.log('Updating prompt template:', promptId);

    const existingTemplate = this.promptTemplateService.getTemplate(promptId);
    if (!existingTemplate) {
      throw new Error(`Prompt template with ID ${promptId} not found`);
    }

    const updatedTemplate = {
      ...existingTemplate,
      name: request.name ?? existingTemplate.name,
      prompt: request.prompt ?? existingTemplate.prompt,
      updatedAt: new Date(),
    };

    this.promptTemplateService.updateTemplate(updatedTemplate);

    return updatedTemplate;
  }

  @Put('prompt-templates/by-id/:id')
  async updatePromptTemplateById(
    @Param('id') id: string,
    @Body() request: UpdatePromptTemplateRequestDto,
  ): Promise<PromptTemplateResponseDto> {
    this.logger.log('Updating prompt template by ID:', id);

    const existingTemplate = this.promptTemplateService.getTemplateById(id);
    if (!existingTemplate) {
      throw new Error(`Prompt template with ID ${id} not found`);
    }

    const updatedTemplate = {
      ...existingTemplate,
      name: request.name ?? existingTemplate.name,
      prompt: request.prompt ?? existingTemplate.prompt,
      updatedAt: new Date(),
    };

    this.promptTemplateService.updateTemplate(updatedTemplate);

    return updatedTemplate;
  }

  @Delete('prompt-templates/:promptId')
  async deletePromptTemplate(
    @Param('promptId') promptId: string,
  ): Promise<DeletePromptTemplateResponseDto> {
    this.logger.log('Deleting prompt template:', promptId);

    const existingTemplate = this.promptTemplateService.getTemplate(promptId);
    if (!existingTemplate) {
      throw new Error(`Prompt template with ID ${promptId} not found`);
    }

    const deleted = this.promptTemplateService.deleteTemplate(promptId);
    if (!deleted) {
      throw new Error(`Failed to delete prompt template with ID ${promptId}`);
    }

    return {
      success: true,
      message: `Prompt template '${existingTemplate.name}' has been successfully deleted`,
    };
  }
}
