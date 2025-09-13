import { nanoid } from 'nanoid';

export class KeyUtils {
  static generate(size?: number): string {
    return nanoid(size);
  }

  static isValid(id: string): boolean {
    const nanoidRegex = /^[A-Za-z0-9_-]+$/;
    return nanoidRegex.test(id) && id.length >= 1 && id.length <= 100;
  }
}
