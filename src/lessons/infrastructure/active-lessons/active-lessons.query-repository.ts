import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import {
  ActiveLesson,
  ActiveLessonWithEvaluationsUsersOutputModel,
} from '../../api/models/lesson/lesson.output.model';
import { activeLessonsTable } from '../../../common/infrastructure/drizzle/schemas/active-lessons.schema';
import { eq, sql } from 'drizzle-orm';

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

  async getAllActiveLessons(): Promise<
    ActiveLessonWithEvaluationsUsersOutputModel[]
  > {
    const rawQuery = sql`
    SELECT
      al.id AS id,
      l.name AS name,
      l.code AS code,
      jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'score', e.score,
          'user', jsonb_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
          )
        )
      ) AS evaluations
    FROM
    active_lessons AS al
    JOIN
    lessons AS l ON l.id = al.lesson_id
    LEFT JOIN
    user_active_lessons_evaluations AS uale ON uale.active_lesson_id = al.id
    LEFT JOIN
    evaluations AS e ON e.id = uale.evaluation_id
    LEFT JOIN
    users AS u ON u.id = uale.user_id
    --WHERE e.id IS NOT NULL
    GROUP BY
    al.id, l.name, l.code`;

    const result = await this.db.execute(rawQuery);

    if (result.rows.length > 0) {
      return await Promise.all(
        result.rows.map((activeLesson) =>
          this.activeLessonMapper(activeLesson),
        ),
      );
    } else {
      return [];
    }
  }

  async activeLessonMapper(activeLesson) {
    return {
      id: activeLesson.id.toString(),
      name: activeLesson.name,
      code: activeLesson.code,
      evaluations:
        activeLesson.evaluations.length > 0
          ? activeLesson.evaluations
              .filter((evaluation) => evaluation.id !== null)
              .map((evaluation) => {
                return {
                  id: evaluation.id.toString(),
                  score: evaluation.score.toString(),
                  user: {
                    id: evaluation.user.id.toString(),
                    name: evaluation.user.name,
                    email: evaluation.user.email,
                  },
                };
              })
          : [],
    };
  }
}
