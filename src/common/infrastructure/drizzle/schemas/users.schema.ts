import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userActiveLessonsEvaluationsTable } from './user-active-lessons-evaluations.schema';

export const usersTable = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 30 }).notNull().unique(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  userActiveLessonsEvaluationsTable: many(userActiveLessonsEvaluationsTable),
}));
