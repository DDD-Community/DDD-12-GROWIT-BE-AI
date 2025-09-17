export interface CreateAdviceCommand {
  userId: string;
  promptId: string;
  input: string; // JSON string
}

export interface UpdateAdviceCommand {
  id: string;
  output: string;
}

export interface GetAdviceCommand {
  id: string;
}

export interface ListAdviceCommand {
  userId?: string;
  promptId?: string;
  limit?: number;
  offset?: number;
}
