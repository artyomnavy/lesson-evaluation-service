import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserActiveLessonsEvaluationsRepository } from '../../../infrastructure/records-grade-book/user-active-lessons-evaluations-repository.service';
import { UsersQueryRepository } from '../../../../users/infrastructure/users.query-repository';
import { EvaluationsRepository } from '../../../infrastructure/evaluations/evaluations.repository';
import { UserActiveLessonsEvaluationsQueryRepository } from '../../../infrastructure/records-grade-book/user-active-lessons-evaluations-query-repository.service';
import { EvaluationOutputModel } from '../../../api/models/evaluation/evaluation.output.model';
import { ActiveLessonsQueryRepository } from '../../../infrastructure/active-lessons/active-lessons.query-repository';
import { ResultType } from '../../../../common/types';
import { ResultCodes } from '../../../../common/utils';

export class CreateEvaluationCommand {
  constructor(
    public readonly activeLessonId: string,
    public readonly userId: string,
    public readonly score: string,
  ) {}
}
@CommandHandler(CreateEvaluationCommand)
export class CreateEvaluationUseCase
  implements ICommandHandler<CreateEvaluationCommand>
{
  constructor(
    private readonly userActiveLessonsEvaluationsQueryRepository: UserActiveLessonsEvaluationsQueryRepository,
    private readonly userActiveLessonsEvaluationsRepository: UserActiveLessonsEvaluationsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly evaluationsRepository: EvaluationsRepository,
    private readonly activeLessonsQueryRepository: ActiveLessonsQueryRepository,
  ) {}

  async execute(
    command: CreateEvaluationCommand,
  ): Promise<ResultType<EvaluationOutputModel | null>> {
    const { activeLessonId, userId, score } = command;

    const user = await this.usersQueryRepository.getUserById(+userId);

    if (!user) {
      return {
        data: null,
        code: ResultCodes.BAD_REQUEST,
        message: 'User is not exists',
        field: 'userId',
      };
    }

    const activeLesson =
      await this.activeLessonsQueryRepository.getActiveLessonById(
        +activeLessonId,
      );

    if (!activeLesson) {
      return {
        data: null,
        code: ResultCodes.NOT_FOUND,
        message: 'Active lesson is not found',
      };
    }

    const recordGradeBook =
      await this.userActiveLessonsEvaluationsQueryRepository.getRecordGradeBookByActiveLessonIdAndUserId(
        +activeLessonId,
        +userId,
      );

    if (!recordGradeBook) {
      return {
        data: null,
        code: ResultCodes.NOT_FOUND,
        message: 'User is not found in active lesson',
      };
    }

    if (recordGradeBook.evaluationId !== null) {
      return {
        data: null,
        code: ResultCodes.CONFLICT,
        message: 'Evaluation is exists',
      };
    }

    const evaluation =
      await this.evaluationsRepository.createEvaluation(+score);

    await this.userActiveLessonsEvaluationsRepository.addEvaluationToRecordGradeBook(
      recordGradeBook.id,
      evaluation.id,
    );

    return {
      data: {
        id: evaluation.id.toString(),
        userId: user.id.toString(),
        score: evaluation.score!.toString(),
      },
      code: ResultCodes.SUCCESS,
    };
  }
}
