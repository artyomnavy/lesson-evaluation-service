import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { LessonsRepository } from '../../../infrastructure/available-lessons/lessons.repository';
import { LessonsQueryRepository } from '../../../infrastructure/available-lessons/lessons.query-repository';
import { AvailableLessonOutputModel } from '../../../api/models/lesson/lesson.output.model';

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
  ): Promise<AvailableLessonOutputModel> {
    const { name, code } = command;

    const isAvailableLessonExist =
      await this.lessonsQueryRepository.isAvailableLessonExist(name, code);

    if (isAvailableLessonExist) {
      throw new BadRequestException(`Available lesson already exists`);
    }

    return await this.lessonsRepository.createAvailableLesson(name, code);
  }
}
