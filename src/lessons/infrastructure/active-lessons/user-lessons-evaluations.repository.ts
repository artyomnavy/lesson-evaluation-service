import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { userLessonsEvaluationsTable } from '../../../common/infrastructure/drizzle/schemas/user-lessons-evaluations.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserLessonsEvaluationsRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async createActiveLesson(
    activeLesson: { userId: number; lessonId: number }[],
  ) {
    try {
      const result = await this.db
        .insert(userLessonsEvaluationsTable)
        .values(activeLesson)
        .returning();

      return result;
    } catch (error) {
      console.error('Error create active lesson:', error);
      throw new Error('Active lesson not create');
    }
  }

  async addEvaluationToActiveLesson(id: number, evaluationId: number) {
    try {
      const result = await this.db
        .update(userLessonsEvaluationsTable)
        // .set({ [userLessonsEvaluationsTable.evaluationId.name]: evaluationId })
        .set({ evaluationId: evaluationId })
        .where(eq(userLessonsEvaluationsTable.id, id))
        .returning();

      return result[0];
    } catch (error) {
      console.error('Error add evaluation to active lesson:', error);
      throw new Error('Evaluation not add to active lesson');
    }
  }
}
