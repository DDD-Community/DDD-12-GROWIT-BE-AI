export interface CreatePromptTemplateCommand {
  promptId: string;
  name: string;
  prompt: string;
}

export interface UpdatePromptTemplateCommand {
  id: string;
  name: string;
  prompt: string;
}

export interface GetPromptTemplateCommand {
  id?: string;
  promptId?: string;
}

export interface ListPromptTemplatesCommand {
  limit?: number;
  offset?: number;
}

export interface DeletePromptTemplateCommand {
  id: string;
}
