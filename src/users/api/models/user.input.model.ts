import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsEmailExist } from '../../../common/decorators/validators/email-exist-validator.decorator';

export class CreateUserModel {
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmailExist({ message: 'Email already exist' })
  @IsEmail()
  @MaxLength(30)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  email: string;
}
