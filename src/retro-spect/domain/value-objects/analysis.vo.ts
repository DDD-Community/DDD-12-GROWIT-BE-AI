export class Analysis {
  constructor(
    public readonly summary: string,
    public readonly advice: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.summary || this.summary.trim().length === 0) {
      throw new Error('Summary cannot be empty');
    }
    if (!this.advice || this.advice.trim().length === 0) {
      throw new Error('Advice cannot be empty');
    }
    if (this.summary.length < 100) {
      throw new Error('Summary must be at least 100 characters');
    }
    if (this.advice.length < 100) {
      throw new Error('Advice must be at least 100 characters');
    }
  }

  toJSON() {
    return {
      summary: this.summary,
      advice: this.advice,
    };
  }

  static fromJSON(json: { summary: string; advice: string }): Analysis {
    return new Analysis(json.summary, json.advice);
  }
}
