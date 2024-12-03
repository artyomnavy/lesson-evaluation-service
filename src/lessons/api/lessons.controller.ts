import { Param, Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { HttpStatuses } from '../../common/utils';
import {
  CreateActiveLessonModel,
  CreateAvailableLessonModel,
} from './models/lesson/lesson.input.model';
import {
  LessonOutputModel,
  AvailableLessonOutputModel,
  ActiveLessonWithEvaluationsUsersOutputModel,
} from './models/lesson/lesson.output.model';
import { CreateAvailableLessonCommand } from '../application/use-cases/lesson/create-available-lesson.use-case';
import { CreateActiveLessonAndRecordsToGradeBookCommand } from '../application/use-cases/lesson/create-active-lesson-and-records-to-grade-book.use-case';
import { CreateEvaluationModel } from './models/evaluation/evaluation.input.model';
import { EvaluationOutputModel } from './models/evaluation/evaluation.output.model';
import { CreateEvaluationCommand } from '../application/use-cases/evaluation/create-evaluation-use.case';
import { GetAllActiveLessonsQuery } from '../application/queries/get-all-active-lessons.query';

@Controller('api/lessons')
export class LessonsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatuses.OK_200)
  async getAllActiveLessons(): Promise<
    ActiveLessonWithEvaluationsUsersOutputModel[]
  > {
    return await this.queryBus.execute(new GetAllActiveLessonsQuery());
  }

  @Post('available')
  @HttpCode(HttpStatuses.CREATED_201)
  async createAvailableLesson(
    @Body() createModel: CreateAvailableLessonModel,
  ): Promise<AvailableLessonOutputModel> {
    const { name, code } = createModel;

    return await this.commandBus.execute(
      new CreateAvailableLessonCommand(name, code),
    );
  }

  @Post()
  @HttpCode(HttpStatuses.CREATED_201)
  async createActiveLessonAndRecordsToGradeBook(
    @Body() createModel: CreateActiveLessonModel,
  ): Promise<LessonOutputModel> {
    const { availableLessonName, userIds } = createModel;

    return await this.commandBus.execute(
      new CreateActiveLessonAndRecordsToGradeBookCommand(
        availableLessonName,
        userIds,
      ),
    );
  }

  @Post(':lessonId/evaluations')
  @HttpCode(HttpStatuses.CREATED_201)
  async createEvaluation(
    @Param('lessonId') lessonId: string,
    @Body() createModel: CreateEvaluationModel,
  ): Promise<EvaluationOutputModel> {
    const { userId, score } = createModel;

    return await this.commandBus.execute(
      new CreateEvaluationCommand(lessonId, userId, score),
    );
  }
}
