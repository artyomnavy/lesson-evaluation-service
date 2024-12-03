import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { LessonsQueryRepository } from '../../../infrastructure/available-lessons/lessons.query-repository';
import { LessonOutputModel } from '../../../api/models/lesson/lesson.output.model';
import { UserLessonsEvaluationsRepository } from '../../../infrastructure/records-to-grade-book/user-lessons-evaluations.repository';
import { UsersQueryRepository } from '../../../../users/infrastructure/users.query-repository';
import { ActiveLessonsRepository } from '../../../infrastructure/active-lessons/active-lessons.repository';

export class CreateActiveLessonAndRecordsToGradeBookCommand {
  constructor(
    public readonly availableLessonName: string,
    public readonly userIds: string[],
  ) {}
}
@CommandHandler(CreateActiveLessonAndRecordsToGradeBookCommand)
export class CreateActiveLessonAndRecordsToGradeBookUseCase
  implements ICommandHandler<CreateActiveLessonAndRecordsToGradeBookCommand>
{
  constructor(
    private readonly userLessonsEvaluationsRepository: UserLessonsEvaluationsRepository,
    private readonly lessonsQueryRepository: LessonsQueryRepository,
    private readonly activeLessonsRepository: ActiveLessonsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(
    command: CreateActiveLessonAndRecordsToGradeBookCommand,
  ): Promise<LessonOutputModel> {
    const { availableLessonName, userIds } = command;

    const availableLesson =
      await this.lessonsQueryRepository.getAvailableLessonByName(
        availableLessonName,
      );

    if (!availableLesson) {
      throw new BadRequestException([`Available lesson is not exists`]);
    }

    for (const userId of userIds) {
      const user = await this.usersQueryRepository.getUserById(+userId);

      if (!user) {
        throw new BadRequestException([`User with id=${userId} is not exists`]);
      }
    }

    const activeLesson = await this.activeLessonsRepository.createActiveLesson(
      availableLesson.id,
    );

    const recordsToGradeBook = userIds.map((userId) => ({
      userId: +userId,
      activeLessonId: activeLesson.id,
    }));

    await this.userLessonsEvaluationsRepository.createRecordsToGradeBook(
      recordsToGradeBook,
    );

    return {
      id: activeLesson.id.toString(),
      name: availableLesson.name,
      code: availableLesson.code,
    };
  }
}
