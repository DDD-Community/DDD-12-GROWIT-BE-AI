import { Injectable, Logger } from '@nestjs/common';
import { match } from 'ts-pattern';
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

**중요: 반드시 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.**

**길이 요구사항 (절대 필수):**
- summary는 반드시 100자 이상이어야 합니다. 100자 미만이면 절대 안 됩니다.
- advice는 반드시 100자 이상이어야 합니다. 100자 미만이면 절대 안 됩니다.
- 각 필드는 최소 100자, 권장 150자 이상으로 작성하세요.

summary:
[조건]
- 반드시 100자 이상 (절대 100자 미만이면 안 됩니다)
- 문장 어미는 "~니다"로 통일
- 최소 3문장 이상 구성 (100자 이상을 보장하기 위해)
[내용]
- 첫 문장은 Copywriting이 될만한 핵심적인 목표 전반 요약
- 이어서 세부적인 목표 진행 과정과 맥락 서술
- retrospects나 todos가 비어있더라도, goal 정보를 바탕으로 충분히 긴 요약을 작성하세요
- 목표의 의미, 목표 달성 과정, 목표의 가치 등을 포함하여 최소 100자를 확보하세요

advice:
[조건]
- 반드시 100자 이상 (절대 100자 미만이면 안 됩니다)
- 문장 어미는 "~다냥"으로 통일
- 최소 3문장 이상 구성 (100자 이상을 보장하기 위해)
[내용]
- 목표 진행 과정에서 잘한 점(강점) 분석
- 개선해야 할 점(약점) 분석
- 사례와 근거 기반
- retrospects나 todos가 비어있더라도, goal 정보를 바탕으로 일반적인 조언을 제공하세요
- 목표 달성을 위한 구체적인 조언, 다음 단계 제안 등을 포함하여 최소 100자를 확보하세요
- 문장을 깔끔하고 가독성 있게 구성

출력 포맷(JSON만, 다른 텍스트 없이):
{
  "summary": "...",
  "advice": "..."
}`;

  constructor(private readonly openaiService: OpenAIService) {}

  async generateAnalysis(input: RetrospectAnalysisInput): Promise<Analysis> {
    this.logger.log(`Generating analysis for goalId: ${input.goal.id}`);

    const userMessage = this.buildUserMessage(input);

    const response = await this.openaiService.createChatCompletion(
      [
        { role: 'system', content: this.SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      {
        temperature: 0.7,
        max_tokens: 2000,
      },
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const analysisJson = this.parseJsonResponse(content);

    this.logger.log(
      `Analysis generated for goalId: ${input.goal.id} (summary: ${analysisJson.summary.length} chars, advice: ${analysisJson.advice.length} chars)`,
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

    const hasRetrospects = payload.retrospects.length > 0;
    const hasTodos = payload.todos.length > 0;

    const baseMessage = `goal = ${JSON.stringify(payload.goal, null, 2)}
retrospects = ${JSON.stringify(payload.retrospects, null, 2)}
todos = ${JSON.stringify(payload.todos, null, 2)}

위 데이터를 기반으로 summary와 advice를 작성해주세요.`;

    const additionalNote = match({ hasRetrospects, hasTodos })
      .with(
        { hasRetrospects: false, hasTodos: false },
        () =>
          'retrospects와 todos가 비어있지만, goal 정보를 바탕으로 충분히 상세하고 의미있는 분석을 작성해주세요. summary와 advice 모두 최소 100자 이상이어야 합니다.',
      )
      .with(
        { hasRetrospects: false, hasTodos: true },
        () =>
          'retrospects가 비어있지만, goal과 todos 정보를 바탕으로 분석을 작성해주세요. summary와 advice 모두 최소 100자 이상이어야 합니다.',
      )
      .with(
        { hasRetrospects: true, hasTodos: false },
        () =>
          'todos가 비어있지만, goal과 retrospects 정보를 바탕으로 분석을 작성해주세요. summary와 advice 모두 최소 100자 이상이어야 합니다.',
      )
      .otherwise(() => null);

    return additionalNote
      ? `${baseMessage}\n\n참고: ${additionalNote}`
      : baseMessage;
  }

  private parseJsonResponse(content: string): {
    summary: string;
    advice: string;
  } {
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
        `Failed to parse JSON response: ${cleaned.substring(0, 200)}`,
        error.stack,
      );
      throw new Error(`Invalid JSON response from OpenAI: ${error.message}`);
    }
  }
}
