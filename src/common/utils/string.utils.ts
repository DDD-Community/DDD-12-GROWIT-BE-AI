export class StringUtils {
  /**
   * Truncate string to specified length
   */
  static truncate(str: string, maxLength: number, suffix = '...'): string {
    if (!str || str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Check if string is valid JSON
   */
  static isValidJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove markdown code fences from string
   */
  static removeCodeFences(str: string): string {
    return str
      .replace(/```json\n?/g, '')
      .replace(/```typescript\n?/g, '')
      .replace(/```javascript\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  /**
   * Sanitize string for safe output
   */
  static sanitize(str: string): string {
    if (!str) return '';
    return str
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim();
  }

  /**
   * Convert to kebab-case
   */
  static toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Convert to camelCase
   */
  static toCamelCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, (char) => char.toLowerCase());
  }

  /**
   * Mask sensitive data (e.g., API keys, passwords)
   */
  static mask(str: string, visibleChars = 4, maskChar = '*'): string {
    if (!str || str.length <= visibleChars) {
      return maskChar.repeat(8);
    }
    const visible = str.slice(-visibleChars);
    const masked = maskChar.repeat(str.length - visibleChars);
    return masked + visible;
  }

  /**
   * Extract JSON from string (handles code fences)
   */
  static extractJson<T = any>(str: string): T | null {
    try {
      const cleaned = this.removeCodeFences(str);
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}
