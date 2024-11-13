import { DrizzleModule } from '../common/infrastructure/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { GetAllUsersQueryHandler } from './application/queries/get-all-users.query';
import { UsersQueryRepository } from './infrastructure/users.query-repository';

const usersControllers = [UsersController];

const usersQueries = [GetAllUsersQueryHandler];

const usersRepositories = [UsersQueryRepository];

@Module({
  imports: [DrizzleModule],
  controllers: [...usersControllers],
  providers: [...usersQueries, ...usersRepositories],
})
export class UserModule {}
