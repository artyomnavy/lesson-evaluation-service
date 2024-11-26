import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAvailableLessonModel {
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

export class CreateActiveLessonModel {
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  availableLessonName: string;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
