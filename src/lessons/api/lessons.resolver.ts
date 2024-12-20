import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ResultCodes, resultCodeToHttpException } from '../../common/utils';
import {
  CreateActiveLessonModel,
  CreateAvailableLessonModel,
} from './models/lesson/lesson.input.model';
import {
  ActiveLessonWithEvaluationsUsersGqlOutputModel,
  AvailableLessonGqlOutputModel,
  LessonGqlOutputModel,
} from './models/lesson/lesson.output.model';
import { CreateAvailableLessonCommand } from '../application/use-cases/lesson/create-available-lesson.use-case';
import { CreateActiveLessonAndRecordsToGradeBookCommand } from '../application/use-cases/lesson/create-active-lesson-and-records-to-grade-book.use-case';
import { CreateEvaluationModel } from './models/evaluation/evaluation.input.model';
import { EvaluationGqlOutputModel } from './models/evaluation/evaluation.output.model';
import { CreateEvaluationCommand } from '../application/use-cases/evaluation/create-evaluation-use.case';
import { GetAllActiveLessonsQuery } from '../application/queries/get-all-active-lessons.query';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class LessonsResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => [ActiveLessonWithEvaluationsUsersGqlOutputModel])
  async getAllActiveLessons(): Promise<
    ActiveLessonWithEvaluationsUsersGqlOutputModel[]
  > {
    return await this.queryBus.execute(new GetAllActiveLessonsQuery());
  }

  @Mutation(() => AvailableLessonGqlOutputModel)
  async createAvailableLesson(
    @Args('createModel') createModel: CreateAvailableLessonModel,
  ): Promise<AvailableLessonGqlOutputModel> {
    const { name, code } = createModel;

    const result = await this.commandBus.execute(
      new CreateAvailableLessonCommand(name, code),
    );

    if (result.code !== ResultCodes.SUCCESS) {
      resultCodeToHttpException(result.code, result.message, result.field);
    }

    return result.data;
  }

  @Mutation(() => LessonGqlOutputModel)
  async createActiveLessonAndRecordsToGradeBook(
    @Args('createModel') createModel: CreateActiveLessonModel,
  ): Promise<LessonGqlOutputModel> {
    const { availableLessonName, userIds } = createModel;

    const result = await this.commandBus.execute(
      new CreateActiveLessonAndRecordsToGradeBookCommand(
        availableLessonName,
        userIds,
      ),
    );

    if (result.code !== ResultCodes.SUCCESS) {
      resultCodeToHttpException(result.code, result.message, result.field);
    }

    return result.data;
  }

  @Mutation(() => EvaluationGqlOutputModel)
  async createEvaluation(
    @Args('activeLessonId') activeLessonId: string,
    @Args('createModel') createModel: CreateEvaluationModel,
  ): Promise<EvaluationGqlOutputModel> {
    const { userId, score } = createModel;

    const result = await this.commandBus.execute(
      new CreateEvaluationCommand(activeLessonId, userId, score),
    );

    if (result.code !== ResultCodes.SUCCESS) {
      resultCodeToHttpException(result.code, result.message, result.field);
    }

    return result.data;
  }
}
