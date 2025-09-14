export class ValidationUtils {
  static isValidAdviceResponse(response: string): boolean {
    if (!response || response.trim().length === 0) {
      return false;
    }

    const sentences = response
      .split(/[.!?]/)
      .filter((s) => s.trim().length > 0);
    return sentences.length >= 2 && sentences.length <= 3;
  }

  static isValidGoalResponse(response: string): boolean {
    if (!response || response.trim().length === 0) {
      return false;
    }

    const trimmed = response.trim();
    return trimmed.length >= 10 && trimmed.length <= 20;
  }

  static sanitizeResponse(response: string): string {
    return response.trim().replace(/\n\n+/g, '\n').replace(/\s\s+/g, ' ');
  }
}
