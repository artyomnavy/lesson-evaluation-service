import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { userLessonsEvaluationsTable } from '../../../common/infrastructure/drizzle/schemas/user-lessons-evaluations.schema';
import {
  ActiveLesson,
  ActiveLessonWithEvaluationsUsersOutputModel,
} from '../../api/models/lesson/lesson.output.model';

@Injectable()
export class UserLessonsEvaluationsQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async getActiveLessonByAvailableLessonIdAndUserId(
    lessonId: number,
    userId: number,
  ): Promise<ActiveLesson | null> {
    const lesson: ActiveLesson = await this.db
      .query(userLessonsEvaluationsTable)
      .findFirst<ActiveLesson>({
        where: { lessonId: lessonId },
        andWhere: { userId: userId },
      });

    if (!lesson) {
      return null;
    } else {
      return lesson;
    }
  }

  async getAllActiveLessons(): Promise<
    ActiveLessonWithEvaluationsUsersOutputModel[]
  > {
    // TO DO: write query all active lessons with evaluations and user info
    return [];
  }
}
