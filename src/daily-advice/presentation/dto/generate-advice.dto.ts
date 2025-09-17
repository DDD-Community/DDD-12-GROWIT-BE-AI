import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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
  output: string | null;
  generatedAt: Date | null;
  error?: string;
}
