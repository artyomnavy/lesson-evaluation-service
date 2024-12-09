import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LessonsQueryRepository } from '../../../infrastructure/available-lessons/lessons.query-repository';
import { LessonOutputModel } from '../../../api/models/lesson/lesson.output.model';
import { UserActiveLessonsEvaluationsRepository } from '../../../infrastructure/records-grade-book/user-active-lessons-evaluations-repository.service';
import { UsersQueryRepository } from '../../../../users/infrastructure/users.query-repository';
import { ActiveLessonsRepository } from '../../../infrastructure/active-lessons/active-lessons.repository';
import { ResultType } from '../../../../common/types';
import { ResultCodes } from '../../../../common/utils';

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
    private readonly userActiveLessonsEvaluationsRepository: UserActiveLessonsEvaluationsRepository,
    private readonly lessonsQueryRepository: LessonsQueryRepository,
    private readonly activeLessonsRepository: ActiveLessonsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(
    command: CreateActiveLessonAndRecordsToGradeBookCommand,
  ): Promise<ResultType<LessonOutputModel | null>> {
    const { availableLessonName, userIds } = command;

    const availableLesson =
      await this.lessonsQueryRepository.getAvailableLessonByName(
        availableLessonName,
      );

    if (!availableLesson) {
      return {
        data: null,
        code: ResultCodes.BAD_REQUEST,
        message: 'Available lesson is not exists',
        field: 'availableLessonName',
      };
    }

    for (const userId of userIds) {
      const user = await this.usersQueryRepository.getUserById(+userId);

      if (!user) {
        return {
          data: null,
          code: ResultCodes.BAD_REQUEST,
          message: `User with id=${userId} is not exists`,
          field: 'userIds',
        };
      }
    }

    const activeLesson = await this.activeLessonsRepository.createActiveLesson(
      availableLesson.id,
    );

    const recordsGradeBook = userIds.map((userId) => ({
      userId: +userId,
      activeLessonId: activeLesson.id,
    }));

    await this.userActiveLessonsEvaluationsRepository.createRecordsToGradeBook(
      recordsGradeBook,
    );

    return {
      data: {
        id: activeLesson.id.toString(),
        name: availableLesson.name,
        code: availableLesson.code,
      },
      code: ResultCodes.SUCCESS,
    };
  }
}
