import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { LessonsQueryRepository } from '../../../infrastructure/available-lessons/lessons.query-repository';
import { UserLessonsEvaluationsRepository } from '../../../infrastructure/active-lessons/user-lessons-evaluations.repository';
import { UsersQueryRepository } from '../../../../users/infrastructure/users.query-repository';
import { EvaluationsRepository } from '../../../infrastructure/evaluations/evaluations.repository';
import { UserLessonsEvaluationsQueryRepository } from '../../../infrastructure/active-lessons/user-lessons-evaluations.query-repository';
import { EvaluationOutputModel } from '../../../api/models/evaluation/evaluation.output.model';

export class CreateEvaluationCommand {
  constructor(
    public readonly lessonId: string,
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
    private readonly lessonsQueryRepository: LessonsQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly evaluationsRepository: EvaluationsRepository,
  ) {}

  async execute(
    command: CreateEvaluationCommand,
  ): Promise<EvaluationOutputModel> {
    const { lessonId, userId, score } = command;

    const user = await this.usersQueryRepository.getUserById(+userId);

    if (!user) {
      throw new BadRequestException(`User is not exists`);
    }

    const availableLesson =
      await this.lessonsQueryRepository.getAvailableLessonById(+lessonId);

    if (!availableLesson) {
      throw new NotFoundException(`Available lesson is not found`);
    }

    const activeLesson =
      await this.userLessonsEvaluationsQueryRepository.getActiveLessonByAvailableLessonIdAndUserId(
        +lessonId,
        +userId,
      );

    if (!activeLesson) {
      throw new NotFoundException(`Active lesson is not found`);
    }

    if (activeLesson.evaluationId !== null) {
      throw new ConflictException('Evaluation exist');
    }

    const evaluation =
      await this.evaluationsRepository.createEvaluation(+score);

    // TO DO: write add eval to lesson (update active lesson)

    // await this.userLessonsEvaluationsRepository.addEvaluationToActiveLesson(
    //   activeLesson.id,
    //   evaluation.id,
    // );

    return {
      id: evaluation.id.toString(),
      userId: user.id.toString(),
      score: evaluation.score.toString(),
    };
  }
}
