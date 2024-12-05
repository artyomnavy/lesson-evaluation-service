import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userActiveLessonsEvaluationsTable } from './user-active-lessons-evaluations.schema';
import { lessonsTable } from './lessons.schema';

export const activeLessonsTable = pgTable('active_lessons', {
  id: serial().primaryKey(),
  lessonId: integer('lesson_id')
    .references(() => lessonsTable.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const activeLessonsRelations = relations(
  activeLessonsTable,
  ({ one, many }) => ({
    lesson: one(lessonsTable, {
      fields: [activeLessonsTable.lessonId],
      references: [lessonsTable.id],
    }),
    userActiveLessonsEvaluationsTable: many(userActiveLessonsEvaluationsTable),
  }),
);
