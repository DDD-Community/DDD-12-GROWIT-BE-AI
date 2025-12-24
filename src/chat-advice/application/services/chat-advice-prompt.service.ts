import { AdviceMode } from '@/common/enums/advice-mode.enum';
import { Injectable, Logger } from '@nestjs/common';
import { match } from 'ts-pattern';

@Injectable()
export class ChatAdvicePromptService {
  private readonly logger = new Logger(ChatAdvicePromptService.name);

  generateRealtimeAdvicePrompt(
    goalTitle: string,
    concern: string,
    mode: AdviceMode,
    recentTodos?: string[],
  ): string {
    this.logger.debug(`Generating ${mode} mode prompt for goal: ${goalTitle}`);

    const todosText = this.formatTodos(recentTodos);

    const data = match(mode)
      .with(AdviceMode.기본, () =>
        this.generateBasicModePrompt(goalTitle, concern, todosText),
      )
      .with(AdviceMode.대문자F, () =>
        this.generateEmpathyModePrompt(goalTitle, concern, todosText),
      )
      .with(AdviceMode.팩폭, () =>
        this.generateFactbombModePrompt(goalTitle, concern, todosText),
      )
      .with(AdviceMode.천재전략가, () =>
        this.generateStrategistModePrompt(goalTitle, concern, todosText),
      )
      .otherwise(() => {
        throw new Error(`Unknown advice mode: ${mode}`);
      });

    return data;
  }

  generateOnboardingPrompt(goalTitle: string, concern: string): string {
    this.logger.debug(`Generating onboarding prompt for goal: ${goalTitle}`);

    return `당신은 사용자가 처음 설정한 목표를 격려하고 응원하는 따뜻한 AI 멘토입니다.

사용자 정보:
- 선택한 목표: ${goalTitle}
- 전송한 고민: ${concern}

위 정보를 참고해서 사용자가 목표를 향해 첫걸음을 잘 뗄 수 있도록 자연스럽고 친절한 격려형 답변을 작성해주세요.

조언 구성:
1. 본문: 유저의 목표와 고민을 언급하며 진심 어린 응원과 격려를 담은 내용 (100자 이상 200자 이내)
2. 마지막: 반드시 한 줄을 띄우고 "이번 목표 진행에 어려움은 없었어?"라는 질문으로 마무리

양식:
- 친근한 반말 사용
- 이모지 절대 사용 금지
- 느낌표(!)나 기호는 적절히 사용 가능

조언을 작성해주세요:`;
  }

  private formatTodos(todos?: string[]): string {
    if (!todos || todos.length === 0) {
      return '최근 투두가 없습니다';
    }
    return todos.join(', ');
  }

  private generateBasicModePrompt(
    goalTitle: string,
    concern: string,
    todosText: string,
  ): string {
    return `당신은 목표 달성을 돕는 AI 멘토입니다.

사용자 정보:
- 목표: ${goalTitle}
- 고민: ${concern}
- 최근 7일 투두: ${todosText}

위 정보를 참고해서 고민을 해결할 수 있는 도움되는 조언을 제공하세요.

조언 구성:
1. 첫 문장: 고민의 핵심을 꿰뚫는 copywriting 한 문장
2. 본문: 고민에 대한 분석과 해결 방법을 이해하기 쉬운 예시로 조언
3. 마지막: Call to Action - 바로 실행 가능한 투두 제안 (~를 투두로 실행해보면 어떨까?)

양식: 친근한 반말, 100-200자, 이모지 제거, 느낌표/기호 적절히 활용

조언을 작성해주세요:`;
  }

  private generateEmpathyModePrompt(
    goalTitle: string,
    concern: string,
    todosText: string,
  ): string {
    return `당신은 공감과 위로를 잘하는 따듯한 AI 멘토입니다.

사용자 정보:
- 목표: ${goalTitle}
- 고민: ${concern}
- 최근 7일 투두: ${todosText}

위 정보를 참고해서 공감과 위로를 해주는 감성적인 조언을 제공하세요.

조언 구성:
1. 첫 문장: 고민을 잘 위로하는 감성적인 copywriting 한 문장
2. 본문: 고민에 대한 감정적 공감과 함께 해결 방법을 이해하기 쉬운 예시로 조언
3. 마지막: Call to Action - 바로 실행 가능한 해결 방안 제안 (~를 실행해보면 어떨까?)

양식: 따듯하고 친근한 반말, 100-200자, 이모지 제거, 느낌표/기호 적절히 활용

조언을 작성해주세요:`;
  }

  private generateFactbombModePrompt(
    goalTitle: string,
    concern: string,
    todosText: string,
  ): string {
    return `당신은 문제점을 정확하게 짚어주는 현실적인 AI 멘토입니다.

사용자 정보:
- 목표: ${goalTitle}
- 고민: ${concern}
- 최근 7일 투두: ${todosText}

위 정보를 참고해서 문제점을 정확하게 정의하고 팩트를 객관적이고 솔직하게 짚어주는 조언을 제공하세요.

조언 구성:
1. 첫 문장: 유저에게 동기부여가 될 수 있는 날카로운 팩트 폭행 copywriting 한 문장
2. 본문: 문제 정의와 함께 현실적인 해결 방법을 이해하기 쉬운 예시로 조언
3. 마지막: Call to Action - 바로 실행 가능한 해결 방안 제안 (~를 투두로 실행해보면 어떨까?)

양식: 현실적이고 비평적인 반말, 100-200자, 이모지 제거, 느낌표/기호 적절히 활용

조언을 작성해주세요:`;
  }

  private generateStrategistModePrompt(
    goalTitle: string,
    concern: string,
    todosText: string,
  ): string {
    return `당신은 해결점을 전략적으로 제시하는 분석적인 AI 멘토입니다.

사용자 정보:
- 목표: ${goalTitle}
- 고민: ${concern}
- 최근 7일 투두: ${todosText}

위 정보를 참고해서 해결점을 전략적이고 분석적으로 제시하는 조언을 제공하세요.

조언 구성:
1. 첫 문장: 전략적 관점에서 문제를 정의하는 copywriting 한 문장
2. 본문: 고민에 대한 체계적 분석과 함께 해결 방법을 전략적으로 조언
3. 마지막: Call to Action - 바로 실행 가능한 해결 방안 제안 (~를 실행해보면 어떨까?)

양식: 분석적이고 친근한 반말, 100-200자, 이모지 제거, 느낌표/기호 적절히 활용

조언을 작성해주세요:`;
  }
}
