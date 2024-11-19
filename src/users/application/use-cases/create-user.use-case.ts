import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserOutputModel } from '../../api/models/user.output.model';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';
import { BadRequestException } from '@nestjs/common';

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

  async execute(command: CreateUserCommand): Promise<UserOutputModel> {
    const { name, email } = command;

    const isEmailExist = await this.usersQueryRepository.isEmailExist(email);

    if (isEmailExist) {
      throw new BadRequestException(`Email already exists: ${email}`);
    }

    return await this.usersRepository.createUser(name, email);
  }
}
