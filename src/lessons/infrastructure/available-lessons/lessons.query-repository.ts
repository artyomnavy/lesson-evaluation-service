import { Inject, Injectable } from '@nestjs/common';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { lessonsTable } from '../../../common/infrastructure/drizzle/schemas/lessons.schema';
import { eq, or } from 'drizzle-orm';
import { AvailableLessonOutputModel } from '../../api/models/lesson/lesson.output.model';

@Injectable()
export class LessonsQueryRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private readonly db: DrizzlePgDB,
  ) {}

  async isAvailableLessonExist(name: string, code: string): Promise<boolean> {
    const lessons = await this.db
      .select()
      .from(lessonsTable)
      .where(or(eq(lessonsTable.name, name), eq(lessonsTable.code, code)));

    return lessons.length > 0;
  }

  async getAvailableLessonByName(
    name: string,
  ): Promise<AvailableLessonOutputModel | null> {
    const lessons = await this.db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.name, name));

    if (lessons.length > 0) {
      return lessons[0];
    } else {
      return null;
    }
  }

  async getAvailableLessonById(
    id: number,
  ): Promise<AvailableLessonOutputModel | null> {
    const lessons = await this.db
      .select()
      .from(lessonsTable)
      .where(eq(lessonsTable.id, id));

    if (lessons.length > 0) {
      return lessons[0];
    } else {
      return null;
    }
  }
}
