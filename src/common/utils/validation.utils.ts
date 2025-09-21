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
    if (trimmed.length > 1000) {
      return false;
    }

    // 기본적인 내용 검증 (한국어 또는 영어 텍스트가 있는지)
    const hasContent = /[가-힣a-zA-Z]/.test(trimmed);

    return hasContent;
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

    // 목표는 5-200자 사이로 설정 (더 현실적으로)
    return trimmed.length >= 5 && trimmed.length <= 200;
  }

  static sanitizeResponse(response: string): string {
    if (!response) {
      return '';
    }
    return response.trim().replace(/\n\n+/g, '\n').replace(/\s\s+/g, ' ');
  }
}
