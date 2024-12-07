import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { userActiveLessonsEvaluationsTable } from '../../../common/infrastructure/drizzle/schemas/user-active-lessons-evaluations.schema';
import { RecordGradeBookModel } from '../../api/models/lesson/lesson.output.model';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserActiveLessonsEvaluationsQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async getRecordGradeBookByActiveLessonIdAndUserId(
    activeLessonId: number,
    userId: number,
  ): Promise<RecordGradeBookModel | null> {
    const record =
      await this.db.query.userActiveLessonsEvaluationsTable.findFirst({
        where: eq(
          userActiveLessonsEvaluationsTable.activeLessonId,
          activeLessonId,
        ),
        andWhere: eq(userActiveLessonsEvaluationsTable.userId, userId),
      });

    if (!record) {
      return null;
    } else {
      return record;
    }
  }
}
