import { Param, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { HttpStatuses } from '../../common/utils';
import {
  CreateActiveLessonModel,
  CreateAvailableLessonModel,
} from './models/lesson/lesson.input.model';
import {
  LessonOutputModel,
  AvailableLessonOutputModel,
} from './models/lesson/lesson.output.model';
import { CreateAvailableLessonCommand } from '../application/use-cases/lesson/create-available-lesson-use.case';
import { CreateActiveLessonCommand } from '../application/use-cases/lesson/create-active-lesson-use.case';
import { CreateEvaluationModel } from './models/evaluation/evaluation.input.model';
import { EvaluationOutputModel } from './models/evaluation/evaluation.output.model';
import { CreateEvaluationCommand } from '../application/use-cases/evaluation/create-evaluation-use.case';

@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly commandBus: CommandBus) {}

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
  async createActiveLesson(
    @Body() createModel: CreateActiveLessonModel,
  ): Promise<LessonOutputModel> {
    const { availableLessonName, userIds } = createModel;

    return await this.commandBus.execute(
      new CreateActiveLessonCommand(availableLessonName, userIds),
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
