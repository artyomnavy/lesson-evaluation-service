import { LessonOutputModel } from '../api/models/lesson.output.model';
import { DrizzlePgDB } from '../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { lessonsTable } from '../../common/infrastructure/drizzle/schemas/lessons.schema';

@Injectable()
export class LessonsRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async createLesson(name: string, code: string): Promise<LessonOutputModel> {
    try {
      const result = await this.db
        .insert(lessonsTable)
        .values({ name: name, code: code })
        .returning();

      return {
        id: result[0].id.toString(),
        name: result[0].name,
        code: result[0].code,
      };
    } catch (error) {
      console.error('Error create lesson:', error);
      throw new Error('Lesson not create');
    }
  }
}
