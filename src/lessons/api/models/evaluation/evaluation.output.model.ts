import { ApiProperty } from '@nestjs/swagger';

export class EvaluationOutputModel {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  userId: string;
  @ApiProperty({ type: String })
  score: string;
}
