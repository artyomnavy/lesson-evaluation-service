import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { userLessonsEvaluationsTable } from '../../../common/infrastructure/drizzle/schemas/user-lessons-evaluations.schema';
import {
  ActiveLessonWithEvaluationsUsersOutputModel,
  RecordGradeBookModel,
} from '../../api/models/lesson/lesson.output.model';

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
    const record = await this.db
      .query(userLessonsEvaluationsTable)
      .findFirst<RecordGradeBookModel>({
        where: { activeLessonId: activeLessonId },
        andWhere: { userId: userId },
      });

    if (!record) {
      return null;
    } else {
      return record;
    }
  }

  async getAllActiveLessons(): Promise<
    ActiveLessonWithEvaluationsUsersOutputModel[]
  > {
    // TO DO: write query all active lessons with evaluations and user info
    return [];
  }
}
