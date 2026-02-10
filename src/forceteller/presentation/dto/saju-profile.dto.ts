import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SajuProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['M', 'F'])
  gender: 'M' | 'F';

  @IsIn(['S', 'L'])
  calendar: 'S' | 'L'; // Solar or Lunar

  @IsString()
  @IsNotEmpty()
  birthday: string; // YYYY/MM/DD

  @IsString()
  @IsNotEmpty()
  birthtime: string; // HH:mm

  @IsBoolean()
  hmUnsure: boolean;

  @IsBoolean()
  midnightAdjust: boolean;

  @IsInt()
  year: number;

  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @IsInt()
  @Min(1)
  @Max(31)
  day: number;

  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  min: number;
}
