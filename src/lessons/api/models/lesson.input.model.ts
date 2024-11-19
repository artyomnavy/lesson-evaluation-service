import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLessonModel {
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  code: string;
}
