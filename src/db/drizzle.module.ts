import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schemas/schema';

const pgOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'db',
      useFactory: async () => {
        const pool = new Pool(pgOptions);
        return drizzle<typeof schema>(pool, { schema });
      },
    },
  ],
  exports: ['db'],
})
export class DrizzleModule {}
