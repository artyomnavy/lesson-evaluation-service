import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAvailableLessonModel {
  @Field()
  @ApiProperty({ type: String, maxLength: 100 })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @ApiProperty({ type: String, maxLength: 20 })
  @MaxLength(20)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  code: string;
}

@InputType()
export class CreateActiveLessonModel {
  @Field()
  @ApiProperty({ type: String, maxLength: 100 })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  availableLessonName: string;

  @Field(() => [String])
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
