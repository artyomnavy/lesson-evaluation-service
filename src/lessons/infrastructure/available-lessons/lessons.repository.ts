import { AvailableLessonOutputModel } from '../../api/models/lesson/lesson.output.model';
import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { lessonsTable } from '../../../common/infrastructure/drizzle/schemas/lessons.schema';

@Injectable()
export class LessonsRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async createAvailableLesson(
    name: string,
    code: string,
  ): Promise<AvailableLessonOutputModel> {
    const result = await this.db
      .insert(lessonsTable)
      .values({ name: name, code: code })
      .returning();

    return result[0];
  }
}
