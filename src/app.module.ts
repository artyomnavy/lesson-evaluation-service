import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './common/infrastructure/drizzle/drizzle.module';
import { UserModule } from './users/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { config } from 'dotenv';
import { TestController } from './common/api/testing.controller';
import { LessonModule } from './lessons/lesson.module';

config();

const appControllers = [AppController, TestController];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
    DrizzleModule,
    UserModule,
    LessonModule,
  ],
  controllers: [...appControllers],
  providers: [AppService],
})
export class AppModule {}
