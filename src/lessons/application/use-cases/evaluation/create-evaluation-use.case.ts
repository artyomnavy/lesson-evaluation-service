import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserLessonsEvaluationsRepository } from '../../../infrastructure/records-grade-book/user-lessons-evaluations.repository';
import { UsersQueryRepository } from '../../../../users/infrastructure/users.query-repository';
import { EvaluationsRepository } from '../../../infrastructure/evaluations/evaluations.repository';
import { UserLessonsEvaluationsQueryRepository } from '../../../infrastructure/records-grade-book/user-lessons-evaluations.query-repository';
import { EvaluationOutputModel } from '../../../api/models/evaluation/evaluation.output.model';
import { ActiveLessonsQueryRepository } from '../../../infrastructure/active-lessons/active-lessons.query-repository';

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
    private readonly userLessonsEvaluationsQueryRepository: UserLessonsEvaluationsQueryRepository,
    private readonly userLessonsEvaluationsRepository: UserLessonsEvaluationsRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly evaluationsRepository: EvaluationsRepository,
    private readonly activeLessonsQueryRepository: ActiveLessonsQueryRepository,
  ) {}

  async execute(
    command: CreateEvaluationCommand,
  ): Promise<EvaluationOutputModel> {
    const { activeLessonId, userId, score } = command;

    const user = await this.usersQueryRepository.getUserById(+userId);

    if (!user) {
      throw new BadRequestException(`User is not exists`);
    }

    const activeLesson =
      await this.activeLessonsQueryRepository.getActiveLessonById(
        +activeLessonId,
      );

    if (!activeLesson) {
      throw new NotFoundException(`Active lesson is not found`);
    }

    const recordGradeBook =
      await this.userLessonsEvaluationsQueryRepository.getRecordGradeBookByActiveLessonIdAndUserId(
        +activeLessonId,
        +userId,
      );

    if (!recordGradeBook) {
      throw new NotFoundException(`User is not found in active lesson `);
    }

    if (recordGradeBook.evaluationId !== null) {
      throw new ConflictException('Evaluation is exists');
    }

    const evaluation =
      await this.evaluationsRepository.createEvaluation(+score);

    await this.userLessonsEvaluationsRepository.addEvaluationToRecordGradeBook(
      recordGradeBook.id,
      evaluation.id,
    );

    return {
      id: evaluation.id.toString(),
      userId: user.id.toString(),
      score: evaluation.score!.toString(),
    };
  }
}
