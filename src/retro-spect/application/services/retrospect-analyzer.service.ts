import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../../ai/application/services/openai.service';
import {
  RetrospectAnalysisInput,
  RetrospectAnalyzer,
} from '../../domain/services/retrospect-analyzer.interface';
import { Analysis } from '../../domain/value-objects';

@Injectable()
export class RetrospectAnalyzerService implements RetrospectAnalyzer {
  private readonly logger = new Logger(RetrospectAnalyzerService.name);

  private readonly SYSTEM_PROMPT = `당신은 목표 달성을 위해 미루지 않고 끝까지 달성할 수 있도록 돕는 전문가입니다.
사용자가 제공한 JSON 데이터(goal, retrospects, todos)를 바탕으로 아래 기준에 맞추어 분석하고 요약하세요.

summary:
[조건]
- 100자 이상
- 문장 어미는 "~니다"로 통일
- 2~3문장 구성
[내용]
- 첫 문장은 Copywriting이 될만한 핵심적인 목표 전반 요약
- 이어서 세부적인 목표 진행 과정과 맥락 서술

advice:
[조건]
- 100자 이상
- 문장 어미는 "~다냥"으로 통일
- 2~3문장 구성
[내용]
- 목표 진행 과정에서 잘한 점(강점) 분석
- 개선해야 할 점(약점) 분석
- 사례와 근거 기반
- 문장을 깔끔하고 가독성 있게 구성

출력 포맷(JSON):
{
  "summary": "...",
  "advice": "..."
}`;

  constructor(private readonly openaiService: OpenAIService) {}

  async generateAnalysis(input: RetrospectAnalysisInput): Promise<Analysis> {
    this.logger.log(
      `Generating retrospect analysis for goal: ${input.goal.id}`,
    );

    // Prepare user message with input data
    const userMessage = this.buildUserMessage(input);

    // Call OpenAI
    const response = await this.openaiService.createChatCompletion(
      [
        { role: 'system', content: this.SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      {
        temperature: 0.7,
        max_tokens: 1000,
      },
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse JSON response
    const analysisJson = this.parseJsonResponse(content);

    this.logger.log(
      `Successfully generated analysis for goal: ${input.goal.id}`,
    );

    return new Analysis(analysisJson.summary, analysisJson.advice);
  }

  private buildUserMessage(input: RetrospectAnalysisInput): string {
    const payload = {
      goal: {
        id: input.goal.id,
        title: input.goal.title,
        description: input.goal.description || '',
      },
      retrospects: input.retrospects.map((r) => ({
        id: r.id,
        content: r.content,
        kpt: r.kpt || {},
      })),
      todos: input.todos.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
      })),
    };

    return `goal = ${JSON.stringify(payload.goal, null, 2)}
retrospects = ${JSON.stringify(payload.retrospects, null, 2)}
todos = ${JSON.stringify(payload.todos, null, 2)}

위 데이터를 기반으로 summary와 advice를 작성해주세요.`;
  }

  private parseJsonResponse(content: string): {
    summary: string;
    advice: string;
  } {
    // Remove markdown code fences if present
    let cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    cleaned = cleaned.trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (!parsed.summary || !parsed.advice) {
        throw new Error(
          'Response missing required fields: summary and/or advice',
        );
      }
      return parsed;
    } catch (error) {
      this.logger.error(
        `Failed to parse JSON response: ${cleaned}`,
        error.stack,
      );
      throw new Error(`Invalid JSON response from OpenAI: ${error.message}`);
    }
  }
}
