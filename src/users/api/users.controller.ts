import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserOutputModel } from './models/user.output.model';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserModel } from './models/user.input.model';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import {
  HttpStatuses,
  ResultCodes,
  resultCodeToHttpException,
} from '../../common/utils';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Returns all users' })
  @ApiOkResponse({ description: 'Success', type: [UserOutputModel] })
  @HttpCode(HttpStatuses.OK_200)
  async getAllUsers(): Promise<UserOutputModel[]> {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserModel })
  @ApiCreatedResponse({ description: 'Created', type: UserOutputModel })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        errorsMessages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              field: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatuses.CREATED_201)
  async createUser(
    @Body() createModel: CreateUserModel,
  ): Promise<UserOutputModel> {
    const { name, email } = createModel;

    const result = await this.commandBus.execute(
      new CreateUserCommand(name, email),
    );

    if (result.code !== ResultCodes.SUCCESS) {
      resultCodeToHttpException(result.code, result.message, result.field);
    }

    return result.data;
  }
}
