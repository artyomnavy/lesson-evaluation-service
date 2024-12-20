import { UserGqlOutputModel } from './models/user.output.model';
import { GetAllUsersQuery } from '../application/queries/get-all-users.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserGqlModel } from './models/user.input.model';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { ResultCodes, resultCodeToHttpException } from '../../common/utils';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => UserGqlOutputModel)
export class UsersResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => [UserGqlOutputModel])
  async getAllUsers(): Promise<UserGqlOutputModel[]> {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }

  @Mutation(() => UserGqlOutputModel)
  async createUser(
    @Args('createModel') createModel: CreateUserGqlModel,
  ): Promise<UserGqlOutputModel> {
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
