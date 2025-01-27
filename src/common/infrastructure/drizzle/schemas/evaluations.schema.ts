import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { userActiveLessonsEvaluationsTable } from './user-active-lessons-evaluations.schema';

export const evaluationsTable = pgTable('evaluations', {
  id: serial().primaryKey(),
  score: integer(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const evaluationsRelations = relations(evaluationsTable, ({ many }) => ({
  userActiveLessonsEvaluationsTable: many(userActiveLessonsEvaluationsTable),
}));
