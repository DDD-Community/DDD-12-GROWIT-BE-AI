import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class DtoValidationUtils {
  static getUserIdValidation(): PropertyDecorator[] {
    return [IsString(), IsNotEmpty()];
  }

  static getPromptIdValidation(): PropertyDecorator[] {
    return [IsString(), IsNotEmpty()];
  }

  static getOverallGoalValidation(): PropertyDecorator[] {
    return [
      IsString(),
      IsNotEmpty(),
      MinLength(10, {
        message: 'overallGoal must be at least 10 characters long',
      }),
    ];
  }

  static getStringArrayValidation(
    minSize: number = 1,
    message?: string,
  ): PropertyDecorator[] {
    return [
      IsArray(),
      IsString({ each: true }),
      ArrayMinSize(minSize, {
        message: message || `Array must contain at least ${minSize} item(s)`,
      }),
    ];
  }

  static getOptionalStringArrayValidation(): PropertyDecorator[] {
    return [IsOptional(), IsArray(), IsString({ each: true })];
  }

  static getOptionalStringValidation(): PropertyDecorator[] {
    return [IsOptional(), IsString()];
  }
}
