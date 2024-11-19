import { Inject, Injectable } from '@nestjs/common';
import { DB_DRIZZLE } from '../../common/infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../../common/infrastructure/drizzle/drizzle';
import { lessonsTable } from '../../common/infrastructure/drizzle/schemas/lessons.schema';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class LessonsQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private readonly db: DrizzlePgDB,
  ) {}

  async isLessonExist(name: string, code: string): Promise<boolean> {
    const lessons = await this.db
      .select()
      .from(lessonsTable)
      .where(or(eq(lessonsTable.name, name), eq(lessonsTable.code, code)));

    return lessons.length > 0;
  }
}
