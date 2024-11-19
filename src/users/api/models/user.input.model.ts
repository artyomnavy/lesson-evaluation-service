import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserModel {
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @MaxLength(30)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  email: string;
}
