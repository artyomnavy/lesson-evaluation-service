import { Inject, Injectable } from '@nestjs/common';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { activeLessonsTable } from '../../../common/infrastructure/drizzle/schemas/active-lessons.schema';

@Injectable()
export class ActiveLessonsRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async createActiveLesson(lessonId: number) {
    const result = await this.db
      .insert(activeLessonsTable)
      .values({ lessonId: lessonId })
      .returning();

    return result[0];
  }
}
