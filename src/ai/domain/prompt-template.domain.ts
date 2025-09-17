export interface PromptTemplate {
  id: string; // 실제로는 uid 값
  uid: string;
  name: string;
  personaAndStyle: string;
  outputRules: string;
  insufficientContext: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PromptTemplateDomain implements PromptTemplate {
  constructor(
    public readonly name: string,
    public readonly personaAndStyle: string,
    public readonly outputRules: string,
    public readonly insufficientContext: string,
    public readonly id: string = '', // 실제로는 uid 값
    public readonly uid: string = '',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    name: string,
    personaAndStyle: string,
    outputRules: string,
    insufficientContext: string,
  ): PromptTemplateDomain {
    return new PromptTemplateDomain(
      name,
      personaAndStyle,
      outputRules,
      insufficientContext,
    );
  }

  update(
    name: string,
    personaAndStyle: string,
    outputRules: string,
    insufficientContext: string,
  ): PromptTemplateDomain {
    return new PromptTemplateDomain(
      name,
      personaAndStyle,
      outputRules,
      insufficientContext,
      this.id,
      this.uid,
      this.createdAt,
      new Date(),
    );
  }

  // 전체 프롬프트를 조합하는 메서드
  generateFullPrompt(): string {
    return `${this.personaAndStyle}\n\n${this.outputRules}\n\n${this.insufficientContext}`;
  }
}
