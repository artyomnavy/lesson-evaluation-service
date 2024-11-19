import { LessonsQueryRepository } from './infrastructure/lessons.query-repository';
import { LessonsRepository } from './infrastructure/lessons.repository';
import { CreateLessonUseCase } from './application/use-cases/create-lesson.use-case';
import { LessonsController } from './api/lessons.controller';
import { DrizzleModule } from '../common/infrastructure/drizzle/drizzle.module';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const lessonsControllers = [LessonsController];

const lessonsUseCases = [CreateLessonUseCase];

const lessonsRepositories = [LessonsQueryRepository, LessonsRepository];

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [...lessonsControllers],
  providers: [...lessonsRepositories, ...lessonsUseCases],
})
export class LessonModule {}
