import { UserOutputModel } from '../api/models/user.output.model';
import { Inject, Injectable } from '@nestjs/common';
import { DB_DRIZZLE } from '../../common/infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../../common/infrastructure/drizzle/drizzle';
import { usersTable } from '../../common/infrastructure/drizzle/schemas/users.schema';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private usersQueryRepository: DrizzlePgDB,
  ) {}

  async getAllUsers(): Promise<UserOutputModel[]> {
    const users = await this.usersQueryRepository.select().from(usersTable);

    return users.map((user) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    }));
  }
}
