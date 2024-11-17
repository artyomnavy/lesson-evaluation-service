import { UserOutputModel } from '../api/models/user.output.model';
import { Inject, Injectable } from '@nestjs/common';
import { DB_DRIZZLE } from '../../common/infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../../common/infrastructure/drizzle/drizzle';
import { usersTable } from '../../common/infrastructure/drizzle/schemas/users.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private readonly db: DrizzlePgDB,
  ) {}

  async getAllUsers(): Promise<UserOutputModel[]> {
    const users = await this.db.select().from(usersTable);

    return users.map((user) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    }));
  }

  async isEmailExist(email: string): Promise<boolean> {
    const users = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    console.log(users, 'users');

    return users.length > 0;
  }
}
