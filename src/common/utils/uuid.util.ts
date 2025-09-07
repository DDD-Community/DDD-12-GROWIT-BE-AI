import { nanoid } from 'nanoid';

export class UuidUtil {
  /**
   * 새로운 nanoid 생성 (기본 길이: 21자)
   * @param size ID 길이 (기본값: 21)
   * @returns 생성된 nanoid 문자열
   */
  static generate(size?: number): string {
    return nanoid(size);
  }

  /**
   * nanoid 형식 검증
   * @param id 검증할 ID 문자열
   * @returns 유효한 nanoid인지 여부
   */
  static isValid(id: string): boolean {
    const nanoidRegex = /^[A-Za-z0-9_-]+$/;
    return nanoidRegex.test(id) && id.length >= 1 && id.length <= 100;
  }
}
