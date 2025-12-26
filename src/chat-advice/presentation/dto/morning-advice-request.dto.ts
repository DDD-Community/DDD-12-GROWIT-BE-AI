import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MorningAdviceRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString({ each: true })
  goalTitles: string[];

  @IsOptional()
  @IsString({ each: true })
  recentTodos: string[];

  @IsString()
  @IsOptional()
  previousConversations: string;
}
