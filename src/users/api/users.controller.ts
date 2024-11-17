import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserOutputModel } from './models/user.output.model';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserModel } from './models/user.input.model';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { HttpStatuses } from '../../common/utils';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatuses.OK_200)
  async getAllUsers(): Promise<UserOutputModel[]> {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }

  @Post()
  @HttpCode(HttpStatuses.CREATED_201)
  async createUser(
    @Body() createModel: CreateUserModel,
  ): Promise<UserOutputModel> {
    const { name, email } = createModel;

    return await this.commandBus.execute(new CreateUserCommand(name, email));
  }
}
