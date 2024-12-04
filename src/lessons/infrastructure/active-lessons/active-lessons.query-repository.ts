import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { ActiveLesson } from '../../api/models/lesson/lesson.output.model';
import { activeLessonsTable } from '../../../common/infrastructure/drizzle/schemas/active-lessons.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ActiveLessonsQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async getActiveLessonById(id: number): Promise<ActiveLesson | null> {
    const lesson = await this.db.query.activeLessonsTable.findFirst({
      where: eq(activeLessonsTable.id, id),
    });

    if (!lesson) {
      return null;
    } else {
      return lesson;
    }
  }
}
