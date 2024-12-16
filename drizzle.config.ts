import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: './src/common/infrastructure/drizzle/schemas/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: String(process.env.POSTGRES_HOST),
    user: String(process.env.POSTGRES_USER),
    password: String(process.env.POSTGRES_PASSWORD),
    database: String(process.env.POSTGRES_DATABASE),
    port: Number(process.env.POSTGRES_PORT),
    ssl: false,
  },
});
