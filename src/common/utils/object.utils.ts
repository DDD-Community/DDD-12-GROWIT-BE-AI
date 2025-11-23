export class ObjectUtils {
  /**
   * Deep clone an object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as any;
    }

    if (obj instanceof Array) {
      return obj.map((item) => this.deepClone(item)) as any;
    }

    if (obj instanceof Object) {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }

    return obj;
  }

  /**
   * Remove null/undefined values from object
   */
  static removeNullish<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: any = {};
    for (const key in obj) {
      if (obj[key] != null) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Remove empty strings from object
   */
  static removeEmptyStrings<T extends Record<string, any>>(obj: T): Partial<T> {
    const result: any = {};
    for (const key in obj) {
      if (obj[key] !== '') {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Pick specific keys from object
   */
  static pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Pick<T, K> {
    const result: any = {};
    keys.forEach((key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * Omit specific keys from object
   */
  static omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[],
  ): Omit<T, K> {
    const result: any = { ...obj };
    keys.forEach((key) => {
      delete result[key];
    });
    return result;
  }

  /**
   * Check if object is empty
   */
  static isEmpty(obj: any): boolean {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') {
      return obj.length === 0;
    }
    return Object.keys(obj).length === 0;
  }

  /**
   * Deep merge objects
   */
  static deepMerge<T extends Record<string, any>>(
    target: T,
    ...sources: Partial<T>[]
  ): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(target[key], source[key] as any);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  private static isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
