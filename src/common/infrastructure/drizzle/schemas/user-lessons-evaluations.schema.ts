import { relations } from 'drizzle-orm';
import { usersTable } from './users.schema';
import { lessonsTable } from './lessons.schema';
import { evaluationsTable } from './evaluations.schema';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const userLessonsEvaluationsTable = pgTable('user_lessons_evaluations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .notNull(),
  lessonId: integer('lesson_id')
    .references(() => lessonsTable.id)
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
    lesson: one(lessonsTable, {
      fields: [userLessonsEvaluationsTable.lessonId],
      references: [lessonsTable.id],
    }),
    evaluation: one(evaluationsTable, {
      fields: [userLessonsEvaluationsTable.evaluationId],
      references: [evaluationsTable.id],
    }),
  }),
);
