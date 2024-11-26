import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userLessonsEvaluationsTable } from './user-lessons-evaluations.schema';

export const lessonsTable = pgTable('lessons', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  code: varchar({ length: 20 }).notNull().unique(),
});

export const lessonsRelations = relations(lessonsTable, ({ many }) => ({
  userLessonsEvaluationsTable: many(userLessonsEvaluationsTable),
}));
