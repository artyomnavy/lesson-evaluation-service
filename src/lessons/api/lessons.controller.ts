import { Param, Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  HttpStatuses,
  ResultCodes,
  resultCodeToHttpException,
} from '../../common/utils';
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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('api/lessons')
export class LessonsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Returns all active lessons' })
  @ApiOkResponse({
    description: 'Success',
    type: [ActiveLessonWithEvaluationsUsersOutputModel],
  })
  @HttpCode(HttpStatuses.OK_200)
  async getAllActiveLessons(): Promise<
    ActiveLessonWithEvaluationsUsersOutputModel[]
  > {
    return await this.queryBus.execute(new GetAllActiveLessonsQuery());
  }

  @Post('available')
  @ApiOperation({ summary: 'Create new available lesson' })
  @ApiCreatedResponse({
    description: 'Created',
    type: AvailableLessonOutputModel,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        errorsMessages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              field: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiBody({ type: CreateAvailableLessonModel })
  @HttpCode(HttpStatuses.CREATED_201)
  async createAvailableLesson(
    @Body() createModel: CreateAvailableLessonModel,
  ): Promise<AvailableLessonOutputModel> {
    const { name, code } = createModel;

    const result = await this.commandBus.execute(
      new CreateAvailableLessonCommand(name, code),
    );

    if (result.code !== ResultCodes.SUCCESS) {
      resultCodeToHttpException(result.code, result.message, result.field);
    }

    return result.data;
  }

  @Post()
  @ApiOperation({ summary: 'Create new active lesson' })
  @ApiCreatedResponse({
    description: 'Created',
    type: LessonOutputModel,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        errorsMessages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              field: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiBody({ type: CreateActiveLessonModel })
  @HttpCode(HttpStatuses.CREATED_201)
  async createActiveLessonAndRecordsToGradeBook(
    @Body() createModel: CreateActiveLessonModel,
  ): Promise<LessonOutputModel> {
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

  @Post(':activeLessonId/evaluations')
  @ApiOperation({ summary: 'Create new evaluation' })
  @ApiCreatedResponse({
    description: 'Created',
    type: EvaluationOutputModel,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      type: 'object',
      properties: {
        errorsMessages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              field: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Not found active lesson or user' })
  @ApiConflictResponse({ description: 'Evaluation is exists' })
  @ApiBody({ type: CreateEvaluationModel })
  @HttpCode(HttpStatuses.CREATED_201)
  async createEvaluation(
    @Param('activeLessonId') activeLessonId: string,
    @Body() createModel: CreateEvaluationModel,
  ): Promise<EvaluationOutputModel> {
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
