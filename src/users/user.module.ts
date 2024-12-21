import { DrizzleModule } from '../common/infrastructure/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { GetAllUsersQueryHandler } from './application/queries/get-all-users.query';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import { UsersRepository } from './infrastructure/users.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UsersResolver } from './api/users.resolver';

const usersControllers = [UsersController];

const usersResolvers = [UsersResolver];

const usersQueries = [GetAllUsersQueryHandler];

const usersUseCases = [CreateUserUseCase];

const usersRepositories = [UsersQueryRepository, UsersRepository];

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [...usersControllers],
  providers: [
    // ...usersResolvers,
    ...usersRepositories,
    ...usersQueries,
    ...usersUseCases,
  ],
})
export class UserModule {}
