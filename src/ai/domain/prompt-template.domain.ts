export interface PromptTemplate {
  id: string;
  promptId: string;
  name: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PromptTemplateEntity implements PromptTemplate {
  constructor(
    public readonly id: string,
    public readonly promptId: string,
    public readonly name: string,
    public readonly prompt: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    promptId: string,
    name: string,
    prompt: string,
  ): PromptTemplateEntity {
    const now = new Date();
    return new PromptTemplateEntity(
      '', // ID는 저장 시 생성
      promptId,
      name,
      prompt,
      now,
      now,
    );
  }

  update(name: string, prompt: string): PromptTemplateEntity {
    return new PromptTemplateEntity(
      this.id,
      this.promptId,
      name,
      prompt,
      this.createdAt,
      new Date(),
    );
  }
}
