import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class GenerateAdviceInputDto {
  @IsString()
  @IsNotEmpty()
  mentorType: string;

  @IsArray()
  @IsString({ each: true })
  recentTodos: string[];

  @IsArray()
  @IsString({ each: true })
  weeklyRetrospects: string[];

  @IsString()
  @IsNotEmpty()
  overallGoal: string;
}

export class GenerateAdviceRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  promptId: string;

  @IsNotEmpty()
  input: GenerateAdviceInputDto;
}

export class GenerateAdviceResponseDto {
  success: boolean;
  userId: string;
  promptId: string;
  id?: string;
  output: {
    keep: string;
    try: string;
    problem: string;
  } | null;
  generatedAt: Date | null;
  error?: string;
}

export class AdviceResponseDto {
  @IsString()
  id: string;

  @IsString()
  uid: string;

  @IsString()
  userId: string;

  @IsString()
  promptId: string;

  input: GenerateAdviceInputDto;

  output: {
    keep: string;
    try: string;
    problem: string;
  };

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class AdviceSummaryDto {
  @IsString()
  id: string;

  @IsString()
  uid: string;

  @IsString()
  promptId: string;

  output: {
    keep: string;
    try: string;
    problem: string;
  };

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

export class ListAdviceResponseDto {
  @IsBoolean()
  success: boolean;

  advice: AdviceResponseDto[];
}

export class DeleteAdviceResponseDto {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;
}
