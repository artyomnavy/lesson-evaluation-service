import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserGqlOutputModel } from '../../../../users/api/models/user.output.model';

export class EvaluationOutputModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  score: string;
}

@ObjectType()
export class EvaluationGqlOutputModel {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  score: string;
}

@ObjectType()
export class EvaluationWithUserGqlOutputModel {
  @Field(() => ID)
  id: string;

  @Field()
  score: string;

  @Field(() => UserGqlOutputModel)
  user: UserGqlOutputModel;
}
