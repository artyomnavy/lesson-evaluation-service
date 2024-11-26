import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { LessonsQueryRepository } from '../../../infrastructure/available-lessons/lessons.query-repository';
import { LessonOutputModel } from '../../../api/models/lesson/lesson.output.model';
import { UserLessonsEvaluationsRepository } from '../../../infrastructure/active-lessons/user-lessons-evaluations.repository';
import { UsersQueryRepository } from '../../../../users/infrastructure/users.query-repository';

export class CreateActiveLessonCommand {
  constructor(
    public readonly availableLessonName: string,
    public readonly userIds: string[],
  ) {}
}
@CommandHandler(CreateActiveLessonCommand)
export class CreateActiveLessonUseCase
  implements ICommandHandler<CreateActiveLessonCommand>
{
  constructor(
    private readonly userLessonsEvaluationsRepository: UserLessonsEvaluationsRepository,
    private readonly lessonsQueryRepository: LessonsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(
    command: CreateActiveLessonCommand,
  ): Promise<LessonOutputModel> {
    const { availableLessonName, userIds } = command;

    const availableLesson =
      await this.lessonsQueryRepository.getAvailableLessonByName(
        availableLessonName,
      );

    if (!availableLesson) {
      throw new BadRequestException(`Available lesson is not exists`);
    }

    for (const userId of userIds) {
      const user = await this.usersQueryRepository.getUserById(+userId);

      if (!user) {
        throw new BadRequestException(`User with id=${userId} is not exists`);
      }
    }

    const activeLesson = userIds.map((userId) => ({
      userId: +userId,
      lessonId: availableLesson.id,
    }));

    await this.userLessonsEvaluationsRepository.createActiveLesson(
      activeLesson,
    );

    return {
      id: availableLesson.id.toString(),
      name: availableLesson.name,
      code: availableLesson.code,
    };
  }
}
