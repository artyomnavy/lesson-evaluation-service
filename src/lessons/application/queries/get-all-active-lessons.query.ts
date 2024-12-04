import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserActiveLessonsEvaluationsQueryRepository } from '../../infrastructure/records-grade-book/user-active-lessons-evaluations-query-repository.service';
import { ActiveLessonWithEvaluationsUsersOutputModel } from '../../api/models/lesson/lesson.output.model';

export class GetAllActiveLessonsQuery {
  constructor() {}
}
@QueryHandler(GetAllActiveLessonsQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllActiveLessonsQuery>
{
  constructor(
    private readonly userLessonsEvaluationsQueryRepository: UserActiveLessonsEvaluationsQueryRepository,
  ) {}

  async execute(): Promise<ActiveLessonWithEvaluationsUsersOutputModel[]> {
    return await this.userLessonsEvaluationsQueryRepository.getAllActiveLessons();
  }
}
