import { DrizzlePgDB } from '../../../common/infrastructure/drizzle/drizzle';
import { DB_DRIZZLE } from '../../../common/infrastructure/drizzle/drizzle.module';
import { Inject, Injectable } from '@nestjs/common';
import { evaluationsTable } from '../../../common/infrastructure/drizzle/schemas/evaluations.schema';

@Injectable()
export class EvaluationsRepository {
  constructor(
    @Inject(DB_DRIZZLE)
    private db: DrizzlePgDB,
  ) {}

  async createEvaluation(score: number) {
    try {
      const evaluations = await this.db
        .insert(evaluationsTable)
        .values({ score: score })
        .returning();

      return evaluations[0];
    } catch (error) {
      console.error('Error create evaluation:', error);
      throw new Error('Evaluation not create');
    }
  }
}
