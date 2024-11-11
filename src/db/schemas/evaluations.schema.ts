import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userLessonsEvaluationsTable } from './userLessonsEvaluations.schema';

export const evaluationsTable = pgTable('evaluations', {
  id: serial().primaryKey(),
  score: integer(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const evaluationsRelations = relations(evaluationsTable, ({ many }) => ({
  userLessonsEvaluationsTable: many(userLessonsEvaluationsTable),
}));
