import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEvaluationModel {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  score: string;
}
