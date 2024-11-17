import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserOutputModel } from '../../api/models/user.output.model';
import { UsersRepository } from '../../infrastructure/users.repository';

export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {}
}
@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: CreateUserCommand): Promise<UserOutputModel> {
    const { name, email } = command;

    console.log(command, 'command');

    return await this.usersRepository.createUser(name, email);
  }
}
