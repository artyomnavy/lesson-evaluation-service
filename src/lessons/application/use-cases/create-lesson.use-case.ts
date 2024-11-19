import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LessonOutputModel } from '../../api/models/lesson.output.model';
import { BadRequestException } from '@nestjs/common';
import { LessonsRepository } from '../../infrastructure/lessons.repository';
import { LessonsQueryRepository } from '../../infrastructure/lessons.query-repository';

export class CreateLessonCommand {
  constructor(
    public readonly name: string,
    public readonly code: string,
  ) {}
}
@CommandHandler(CreateLessonCommand)
export class CreateLessonUseCase
  implements ICommandHandler<CreateLessonCommand>
{
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly lessonsQueryRepository: LessonsQueryRepository,
  ) {}

  async execute(command: CreateLessonCommand): Promise<LessonOutputModel> {
    const { name, code } = command;

    const isLessonExist = await this.lessonsQueryRepository.isLessonExist(
      name,
      code,
    );

    if (isLessonExist) {
      throw new BadRequestException(`Lesson already exists`);
    }

    return await this.lessonsRepository.createLesson(name, code);
  }
}
