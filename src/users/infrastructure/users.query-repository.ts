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

    return users.length > 0;
  }

  async getUserById(id: number): Promise<UserOutputModel | null> {
    const users = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (users.length > 0) {
      return {
        id: users[0].id.toString(),
        name: users[0].name,
        email: users[0].email,
      };
    } else {
      return null;
    }
  }
}
