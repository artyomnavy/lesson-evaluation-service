import { relations } from 'drizzle-orm';
import { usersTable } from './users.schema';
import { evaluationsTable } from './evaluations.schema';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { activeLessonsTable } from './active-lessons.schema';

export const userLessonsEvaluationsTable = pgTable('user_lessons_evaluations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  activeLessonId: integer('active_lesson_id')
    .references(() => activeLessonsTable.id)
    .notNull(),
  evaluationId: integer('evaluation_id').references(() => evaluationsTable.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userLessonsEvaluationsRelations = relations(
  userLessonsEvaluationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userLessonsEvaluationsTable.userId],
      references: [usersTable.id],
    }),
    activeLesson: one(activeLessonsTable, {
      fields: [userLessonsEvaluationsTable.activeLessonId],
      references: [activeLessonsTable.id],
    }),
    evaluation: one(evaluationsTable, {
      fields: [userLessonsEvaluationsTable.evaluationId],
      references: [evaluationsTable.id],
    }),
  }),
);
