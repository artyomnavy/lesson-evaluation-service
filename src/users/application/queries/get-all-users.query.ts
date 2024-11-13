import { UserOutputModel } from '../../api/models/user.output.model';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infrastructure/users.query-repository';

export class GetAllUsersQuery {
  constructor() {}
}
@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
{
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async execute(query: GetAllUsersQuery): Promise<UserOutputModel[]> {
    return await this.usersQueryRepository.getAllUsers();
  }
}
