import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserLessonsEvaluationsQueryRepository } from '../../infrastructure/active-lessons/user-lessons-evaluations.query-repository';
import { ActiveLessonWithEvaluationsUsersOutputModel } from '../../api/models/lesson/lesson.output.model';

export class GetAllActiveLessonsQuery {
  constructor() {}
}
@QueryHandler(GetAllActiveLessonsQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllActiveLessonsQuery>
{
  constructor(
    private readonly userLessonsEvaluationsQueryRepository: UserLessonsEvaluationsQueryRepository,
  ) {}

  async execute(): Promise<ActiveLessonWithEvaluationsUsersOutputModel[]> {
    return await this.userLessonsEvaluationsQueryRepository.getAllActiveLessons();
  }
}
