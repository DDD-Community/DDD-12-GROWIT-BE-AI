import { IsNotEmpty, IsString } from 'class-validator';

export class MorningAdviceResponseDto {
  @IsString()
  @IsNotEmpty()
  advice: string;
}
