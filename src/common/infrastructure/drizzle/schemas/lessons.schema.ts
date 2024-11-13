import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userLessonsEvaluationsTable } from './userLessonsEvaluations.schema';

export const lessonsTable = pgTable('lessons', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  code: varchar({ length: 20 }).notNull(),
});

export const lessonsRelations = relations(lessonsTable, ({ many }) => ({
  userLessonsEvaluationsTable: many(userLessonsEvaluationsTable),
}));
