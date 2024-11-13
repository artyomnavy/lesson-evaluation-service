import * as schema from '../schema/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzlePgDB = NodePgDatabase<typeof schema>;
