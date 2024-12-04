import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { ActiveLesson } from '../../api/models/lesson/lesson.output.model';
import { activeLessonsTable } from '../../../common/infrastructure/drizzle/schemas/active-lessons.schema';

@Injectable()
export class ActiveLessonsQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async getActiveLessonById(id: number): Promise<ActiveLesson | null> {
    const lesson: ActiveLesson = await this.db
      .query(activeLessonsTable)
      .findFirst<ActiveLesson>({
        where: { id: id },
      });

    if (!lesson) {
      return null;
    } else {
      return lesson;
    }
  }
}
