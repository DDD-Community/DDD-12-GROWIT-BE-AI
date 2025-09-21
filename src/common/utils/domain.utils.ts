export class DomainUtils {
  static createErrorResult(error: string): {
    success: false;
    entity: null;
    error: string;
  } {
    return {
      success: false,
      entity: null,
      error,
    };
  }

  static createSuccessResult<T>(entity: T): { success: true; entity: T } {
    return {
      success: true,
      entity,
    };
  }
}
