import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailableLessonModel {
  @ApiProperty({ type: String, maxLength: 100 })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, maxLength: 20 })
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class CreateActiveLessonModel {
  @ApiProperty({ type: String, maxLength: 100 })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  availableLessonName: string;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
