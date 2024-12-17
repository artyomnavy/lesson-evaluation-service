import { ApiProperty } from '@nestjs/swagger';

export class UserOutputModel {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  name: string;
  @ApiProperty({ type: String })
  email: string;
}
