import { IsNotEmpty, IsString } from 'class-validator';

export class AdviceStructureDto {
  @IsString()
  @IsNotEmpty()
  keep: string;

  @IsString()
  @IsNotEmpty()
  try: string;

  @IsString()
  @IsNotEmpty()
  problem: string;
}

export class StructuredAdviceResponseDto {
  @IsString()
  @IsNotEmpty()
  keep: string;

  @IsString()
  @IsNotEmpty()
  try: string;

  @IsString()
  @IsNotEmpty()
  problem: string;
}
