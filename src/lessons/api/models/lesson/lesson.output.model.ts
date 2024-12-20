import { ApiProperty } from '@nestjs/swagger';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EvaluationWithUserGqlOutputModel } from '../evaluation/evaluation.output.model';

export class AvailableLessonOutputModel {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  code: string;
}

@ObjectType()
export class AvailableLessonGqlOutputModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  code: string;
}

export class LessonOutputModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  code: string;
}

@ObjectType()
export class LessonGqlOutputModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;
}

export class ActiveLesson {
  id: number;
  lessonId: number;
}

export class RecordGradeBookModel {
  id: number;
  userId: number;
  activeLessonId: number;
  evaluationId: number;
  createdAt: Date;
}

export class ActiveLessonWithEvaluationsUsersOutputModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        score: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  evaluations: {
    id: string;
    score: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

@ObjectType()
export class ActiveLessonWithEvaluationsUsersGqlOutputModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  code: string;

  @Field(() => [EvaluationWithUserGqlOutputModel])
  evaluations: EvaluationWithUserGqlOutputModel[];
}
