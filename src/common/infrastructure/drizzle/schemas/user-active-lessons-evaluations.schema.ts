import { relations } from 'drizzle-orm';
import { usersTable } from './users.schema';
import { evaluationsTable } from './evaluations.schema';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { activeLessonsTable } from './active-lessons.schema';

export const userActiveLessonsEvaluationsTable = pgTable(
  'user_active_lessons_evaluations',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => usersTable.id)
      .notNull(),
    activeLessonId: integer('active_lesson_id')
      .references(() => activeLessonsTable.id)
      .notNull(),
    evaluationId: integer('evaluation_id').references(
      () => evaluationsTable.id,
    ),
    createdAt: timestamp('created_at').defaultNow(),
  },
);

export const userLessonsEvaluationsRelations = relations(
  userActiveLessonsEvaluationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userActiveLessonsEvaluationsTable.userId],
      references: [usersTable.id],
    }),
    activeLesson: one(activeLessonsTable, {
      fields: [userActiveLessonsEvaluationsTable.activeLessonId],
      references: [activeLessonsTable.id],
    }),
    evaluation: one(evaluationsTable, {
      fields: [userActiveLessonsEvaluationsTable.evaluationId],
      references: [evaluationsTable.id],
    }),
  }),
);
