import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ActiveLessonWithEvaluationsUsersOutputModel } from '../../api/models/lesson/lesson.output.model';
import { ActiveLessonsQueryRepository } from '../../infrastructure/active-lessons/active-lessons.query-repository';

export class GetAllActiveLessonsQuery {
  constructor() {}
}
@QueryHandler(GetAllActiveLessonsQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllActiveLessonsQuery>
{
  constructor(
    private readonly activeLessonsQueryRepository: ActiveLessonsQueryRepository,
  ) {}

  async execute(): Promise<ActiveLessonWithEvaluationsUsersOutputModel[]> {
    return await this.activeLessonsQueryRepository.getAllActiveLessons();
  }
}
