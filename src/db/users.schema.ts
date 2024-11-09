import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core/index';

export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 30 }).notNull().unique(),
});
