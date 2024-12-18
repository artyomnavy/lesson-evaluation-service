import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Returns phrase 'Hello World!'" })
  @ApiOkResponse({
    description: 'Success',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
