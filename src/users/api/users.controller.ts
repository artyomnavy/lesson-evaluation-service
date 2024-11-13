import { Controller, Get } from '@nestjs/common';
import { UserOutputModel } from './models/user.output.model';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';
import { QueryBus } from '@nestjs/cqrs';

@Controller('api/users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllUsers(): Promise<UserOutputModel[]> {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }
}
