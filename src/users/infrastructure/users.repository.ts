import { Inject, Injectable } from '@nestjs/common';
import { DB_DRIZZLE } from '../../common/infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../../common/infrastructure/drizzle/drizzle';
import { usersTable } from '../../common/infrastructure/drizzle/schemas/users.schema';
import { UserOutputModel } from '../api/models/user.output.model';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async createUser(name: string, email: string): Promise<UserOutputModel> {
    try {
      const result = await this.db
        .insert(usersTable)
        .values({ name: name, email: email })
        .returning();

      return {
        id: result[0].id.toString(),
        name: result[0].name,
        email: result[0].email,
      };
    } catch (error) {
      console.error('Error create user:', error);
      throw new Error('User not create');
    }
  }
}
