import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { HttpStatuses } from '../../common/utils';
import { CreateLessonModel } from './models/lesson.input.model';
import { LessonOutputModel } from './models/lesson.output.model';
import { CreateLessonCommand } from '../application/use-cases/create-lesson.use-case';

@Controller('api/lessons')
export class LessonsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatuses.CREATED_201)
  async createLesson(
    @Body() createModel: CreateLessonModel,
  ): Promise<LessonOutputModel> {
    const { name, code } = createModel;

    return await this.commandBus.execute(new CreateLessonCommand(name, code));
  }
}
