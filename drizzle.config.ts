import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: './src/common/infrastructure/drizzle/schemas/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: String(process.env.DB_HOST),
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_NAME),
    port: Number(process.env.DB_PORT),
    ssl: false,
  },
});
