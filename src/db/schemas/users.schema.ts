import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userLessonsEvaluationsTable } from './userLessonsEvaluations.schema';

export const usersTable = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 30 }).notNull().unique(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  userLessonsEvaluationsTable: many(userLessonsEvaluationsTable),
}));
