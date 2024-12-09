import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LessonsRepository } from '../../../infrastructure/available-lessons/lessons.repository';
import { LessonsQueryRepository } from '../../../infrastructure/available-lessons/lessons.query-repository';
import { AvailableLessonOutputModel } from '../../../api/models/lesson/lesson.output.model';
import { ResultType } from '../../../../common/types';
import { ResultCodes } from '../../../../common/utils';

export class CreateAvailableLessonCommand {
  constructor(
    public readonly name: string,
    public readonly code: string,
  ) {}
}
@CommandHandler(CreateAvailableLessonCommand)
export class CreateAvailableLessonUseCase
  implements ICommandHandler<CreateAvailableLessonCommand>
{
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly lessonsQueryRepository: LessonsQueryRepository,
  ) {}

  async execute(
    command: CreateAvailableLessonCommand,
  ): Promise<ResultType<AvailableLessonOutputModel | null>> {
    const { name, code } = command;

    const isAvailableLessonExist =
      await this.lessonsQueryRepository.isAvailableLessonExist(name, code);

    if (isAvailableLessonExist) {
      return {
        data: null,
        code: ResultCodes.BAD_REQUEST,
        message: 'Available lesson already exists',
        field: 'availableLessonName',
      };
    }

    const availableLesson = await this.lessonsRepository.createAvailableLesson(
      name,
      code,
    );

    return {
      data: availableLesson,
      code: ResultCodes.SUCCESS,
    };
  }
}
