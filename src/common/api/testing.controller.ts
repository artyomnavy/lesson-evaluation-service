import { Controller, Delete, HttpCode, Inject } from '@nestjs/common';
import { HttpStatuses } from '../utils';
import { DB_DRIZZLE } from '../infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../infrastructure/drizzle/drizzle';
import { usersTable } from '../infrastructure/drizzle/schemas/users.schema';
import { lessonsTable } from '../infrastructure/drizzle/schemas/lessons.schema';
import { evaluationsTable } from '../infrastructure/drizzle/schemas/evaluations.schema';
import { userActiveLessonsEvaluationsTable } from '../infrastructure/drizzle/schemas/user-active-lessons-evaluations.schema';
import { activeLessonsTable } from '../infrastructure/drizzle/schemas/active-lessons.schema';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Testing')
@Controller('api/testing')
export class TestController {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  @Delete('all-data')
  @ApiOperation({ summary: 'Clear database: delete all data from all tables' })
  @ApiNoContentResponse({ description: 'All data is deleted' })
  @HttpCode(HttpStatuses.NO_CONTENT_204)
  async deleteAllData() {
    await this.db.delete(userActiveLessonsEvaluationsTable);
    await this.db.delete(usersTable);
    await this.db.delete(activeLessonsTable);
    await this.db.delete(lessonsTable);
    await this.db.delete(evaluationsTable);
    return;
  }
}
