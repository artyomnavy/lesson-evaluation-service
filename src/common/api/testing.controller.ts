import { Controller, Delete, HttpCode, Inject } from '@nestjs/common';
import { HttpStatuses } from '../utils';
import { DB_DRIZZLE } from '../infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../infrastructure/drizzle/drizzle';
import { usersTable } from '../infrastructure/drizzle/schemas/users.schema';
import { lessonsTable } from '../infrastructure/drizzle/schemas/lessons.schema';

@Controller('testing')
export class TestController {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatuses.NO_CONTENT_204)
  async deleteAllData() {
    await this.db.delete(usersTable);
    await this.db.delete(lessonsTable);
    return;
  }
}
