export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

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

    if (trimmed.length < 10) {
      return false;
    }

    if (trimmed.length > 1000) {
      return false;
    }

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

    return trimmed.length >= 5 && trimmed.length <= 1000;
  }

  static sanitizeResponse(response: string): string {
    if (!response) {
      return '';
    }
    return response.trim().replace(/\n\n+/g, '\n').replace(/\s\s+/g, ' ');
  }

  /**
   * 조언 입력 데이터 검증
   */
  static validateAdviceInput(input: {
    recentTodos?: string[];
    weeklyRetrospects?: string[];
    overallGoal?: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!input.overallGoal || input.overallGoal.trim().length === 0) {
      errors.push('전체 목표는 필수입니다.');
    } else if (input.overallGoal.trim().length < 5) {
      errors.push('전체 목표는 최소 5자 이상이어야 합니다.');
    }

    if (input.recentTodos && !Array.isArray(input.recentTodos)) {
      errors.push('최근 할 일 목록은 배열 형태여야 합니다.');
    }

    if (input.weeklyRetrospects && !Array.isArray(input.weeklyRetrospects)) {
      errors.push('주간 회고는 배열 형태여야 합니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 목표 추천 입력 데이터 검증
   */
  static validateGoalRecommendationInput(input: {
    pastTodos?: string[];
    pastRetrospects?: string[];
    overallGoal?: string;
    completedTodos?: string[];
    pastWeeklyGoals?: string[];
    remainingTime?: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!input.overallGoal || input.overallGoal.trim().length === 0) {
      errors.push('전체 목표는 필수입니다.');
    } else if (input.overallGoal.trim().length < 5) {
      errors.push('전체 목표는 최소 5자 이상이어야 합니다.');
    }

    if (input.pastTodos && !Array.isArray(input.pastTodos)) {
      errors.push('과거 할 일 목록은 배열 형태여야 합니다.');
    }

    if (input.pastRetrospects && !Array.isArray(input.pastRetrospects)) {
      errors.push('과거 회고는 배열 형태여야 합니다.');
    }

    if (input.completedTodos && !Array.isArray(input.completedTodos)) {
      errors.push('완료된 할 일 목록은 배열 형태여야 합니다.');
    }

    if (input.pastWeeklyGoals && !Array.isArray(input.pastWeeklyGoals)) {
      errors.push('과거 주간 목표는 배열 형태여야 합니다.');
    }

    if (input.remainingTime && input.remainingTime.trim().length === 0) {
      errors.push('남은 시간 정보가 비어있습니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 공통 입력 검증 (기본적인 필수 필드 검증)
   */
  static validateCommonInput(input: {
    userId?: string;
    promptId?: string;
  }): ValidationResult {
    const errors: string[] = [];

    if (!input.userId || input.userId.trim().length === 0) {
      errors.push('사용자 ID는 필수입니다.');
    }

    if (!input.promptId || input.promptId.trim().length === 0) {
      errors.push('프롬프트 ID는 필수입니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
