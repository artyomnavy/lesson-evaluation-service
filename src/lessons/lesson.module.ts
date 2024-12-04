import { LessonsQueryRepository } from './infrastructure/available-lessons/lessons.query-repository';
import { LessonsRepository } from './infrastructure/available-lessons/lessons.repository';
import { CreateAvailableLessonUseCase } from './application/use-cases/lesson/create-available-lesson.use-case';
import { LessonsController } from './api/lessons.controller';
import { DrizzleModule } from '../common/infrastructure/drizzle/drizzle.module';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { CreateActiveLessonAndRecordsToGradeBookUseCase } from './application/use-cases/lesson/create-active-lesson-and-records-to-grade-book.use-case';
import { UserLessonsEvaluationsRepository } from './infrastructure/records-grade-book/user-lessons-evaluations.repository';
import { CreateEvaluationUseCase } from './application/use-cases/evaluation/create-evaluation-use.case';
import { UserLessonsEvaluationsQueryRepository } from './infrastructure/records-grade-book/user-lessons-evaluations.query-repository';
import { EvaluationsRepository } from './infrastructure/evaluations/evaluations.repository';
import { UsersQueryRepository } from '../users/infrastructure/users.query-repository';
import { GetAllUsersQueryHandler } from './application/queries/get-all-active-lessons.query';
import { ActiveLessonsRepository } from './infrastructure/active-lessons/active-lessons.repository';
import { ActiveLessonsQueryRepository } from './infrastructure/active-lessons/active-lessons.query-repository';

const lessonsControllers = [LessonsController];

const lessonsUseCases = [
  CreateAvailableLessonUseCase,
  CreateActiveLessonAndRecordsToGradeBookUseCase,
];

const lessonsQueries = [GetAllUsersQueryHandler];

const evaluationsUseCases = [CreateEvaluationUseCase];

const activeLessonsRepositories = [
  ActiveLessonsRepository,
  ActiveLessonsQueryRepository,
];

const recordsToGradeBookRepositories = [
  UserLessonsEvaluationsRepository,
  UserLessonsEvaluationsQueryRepository,
];

const availableLessonsRepositories = [
  LessonsQueryRepository,
  LessonsRepository,
];

const usersRepositories = [UsersQueryRepository];

const evaluationsRepositories = [EvaluationsRepository];

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [...lessonsControllers],
  providers: [
    ...availableLessonsRepositories,
    ...activeLessonsRepositories,
    ...recordsToGradeBookRepositories,
    ...usersRepositories,
    ...lessonsQueries,
    ...lessonsUseCases,
    ...evaluationsUseCases,
    ...evaluationsRepositories,
  ],
})
export class LessonModule {}
