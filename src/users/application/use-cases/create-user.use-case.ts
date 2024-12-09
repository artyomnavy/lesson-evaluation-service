import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserOutputModel } from '../../api/models/user.output.model';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { ResultType } from '../../../common/types';
import { ResultCodes } from '../../../common/utils';

export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<ResultType<UserOutputModel | null>> {
    const { name, email } = command;

    const isEmailExist = await this.usersQueryRepository.isEmailExist(email);

    if (isEmailExist) {
      return {
        data: null,
        code: ResultCodes.BAD_REQUEST,
        message: `Email already exists: ${email}`,
        field: 'email',
      };
    }

    const user = await this.usersRepository.createUser(name, email);

    return {
      data: user,
      code: ResultCodes.SUCCESS,
    };
  }
}
