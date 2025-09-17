export class ValidationUtils {
  static isValidAdviceResponse(response: string): boolean {
    if (
      !response ||
      typeof response !== 'string' ||
      response.trim().length === 0
    ) {
      return false;
    }

    const trimmed = response.trim();

    // 최소 길이 검증 (너무 짧으면 안됨)
    if (trimmed.length < 10) {
      return false;
    }

    // 최대 길이 검증 (너무 길면 안됨)
    if (trimmed.length > 500) {
      return false;
    }

    // 문장 수 검증 (1-5문장 허용, 더 유연하게)
    const sentences = response
      .split(/[.!?]/)
      .filter((s) => s && s.trim().length > 0);

    return sentences.length >= 1 && sentences.length <= 5;
  }

  static isValidGoalResponse(response: string): boolean {
    if (
      !response ||
      typeof response !== 'string' ||
      response.trim().length === 0
    ) {
      return false;
    }

    const trimmed = response.trim();

    // 목표는 5-100자 사이로 설정 (더 현실적으로)
    return trimmed.length >= 5 && trimmed.length <= 100;
  }

  static sanitizeResponse(response: string): string {
    if (!response) {
      return '';
    }
    return response.trim().replace(/\n\n+/g, '\n').replace(/\s\s+/g, ' ');
  }
}
