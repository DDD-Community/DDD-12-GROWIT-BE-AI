import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MorningAdviceRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString({ each: true })
  @IsOptional()
  goalTitles: string[];

  @IsString({ each: true })
  @IsOptional()
  recentTodos: string[];

  @IsString()
  @IsOptional()
  previousConversations: string;
}
