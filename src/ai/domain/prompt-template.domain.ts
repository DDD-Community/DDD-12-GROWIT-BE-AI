export interface PromptTemplate {
  id: string;
  uid: string;
  name: string;
  type: string;
  personaAndStyle: string;
  webSearchProtocol: string;
  outputRules: string;
  insufficientContext: string;
  createdAt: Date;
  updatedAt: Date;
  generateFullPrompt(): string;
}

export class PromptTemplateDomain implements PromptTemplate {
  constructor(
    public readonly name: string,
    public readonly type: string,
    public readonly personaAndStyle: string,
    public readonly webSearchProtocol: string,
    public readonly outputRules: string,
    public readonly insufficientContext: string,
    public readonly id: string = '',
    public readonly uid: string = '',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    name: string,
    type: string,
    personaAndStyle: string = '',
    webSearchProtocol: string = '',
    outputRules: string = '',
    insufficientContext: string = '',
  ): PromptTemplateDomain {
    return new PromptTemplateDomain(
      name,
      type,
      personaAndStyle,
      webSearchProtocol,
      outputRules,
      insufficientContext,
    );
  }

  update(
    name: string,
    type: string,
    personaAndStyle: string = '',
    webSearchProtocol: string = '',
    outputRules: string = '',
    insufficientContext: string = '',
  ): PromptTemplateDomain {
    return new PromptTemplateDomain(
      name,
      type,
      personaAndStyle,
      webSearchProtocol,
      outputRules,
      insufficientContext,
      this.id,
      this.uid,
      this.createdAt,
      new Date(),
    );
  }

  updateContent(
    personaAndStyle: string,
    webSearchProtocol: string,
    outputRules: string,
    insufficientContext: string,
  ): PromptTemplateDomain {
    return new PromptTemplateDomain(
      this.name,
      this.type,
      personaAndStyle,
      webSearchProtocol,
      outputRules,
      insufficientContext,
      this.id,
      this.uid,
      this.createdAt,
      new Date(),
    );
  }

  generateFullPrompt(): string {
    const parts = [];

    if (this.type === '조언') {
      parts.push(
        `당신은 ${this.name}입니다. 다음 정보를 바탕으로 조언을 제공해주세요.`,
      );
    } else if (this.type === '목표추천') {
      parts.push(
        `당신은 ${this.name}입니다. 다음 정보를 바탕으로 이번 주 목표를 추천해주세요.`,
      );
    }

    if (this.personaAndStyle) {
      parts.push(`\n${this.personaAndStyle}`);
    }

    if (this.outputRules) {
      parts.push(`\n${this.outputRules}`);
    }

    if (this.insufficientContext) {
      parts.push(`\n${this.insufficientContext}`);
    }

    parts.push(`\n사용자 정보:`);
    parts.push(`- 최종 목표: {최종 목표}`);
    parts.push(`- 과거 완료 투두: {과거 완료 투두}`);
    parts.push(`- 미완료 투두: {미완료 투두}`);
    parts.push(`- 과거 주차 목표: {과거 주차 목표}`);

    if (this.type === '조언') {
      parts.push(`- 주간 회고: {주간 회고}`);
    } else if (this.type === '목표추천') {
      parts.push(`- 최종 목표까지 남은 기간: {최종 목표까지 남은 기간}`);
    }

    if (this.type === '조언') {
      parts.push(
        `\n위 정보를 바탕으로 한국어로 2-3문장의 구체적이고 실행 가능한 조언을 제공해주세요.`,
      );
    } else if (this.type === '목표추천') {
      parts.push(
        `\n위 정보를 바탕으로 한국어로 1-2줄의 구체적이고 실행 가능한 이번 주 목표를 추천해주세요.`,
      );
    }

    return parts.join('');
  }
}
