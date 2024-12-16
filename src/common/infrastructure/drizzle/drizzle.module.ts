import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas/schema';
import { config } from 'dotenv';

config();

export const DB_DRIZZLE = Symbol('DB_DRIZZLE');

const pgOptions = {
  host: String(process.env.POSTGRES_HOST),
  user: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
  database: String(process.env.POSTGRES_DATABASE),
  port: Number(process.env.POSTGRES_PORT),
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DB_DRIZZLE,
      useFactory: async () => {
        const pool = new Pool(pgOptions);
        return drizzle<typeof schema>(pool, { schema });
      },
    },
  ],
  exports: [DB_DRIZZLE],
})
export class DrizzleModule {}
