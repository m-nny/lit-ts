import { Field, InputType, Int } from '@nestjs/graphql';
import { createEntityType } from '../../utils/entity.utils';
import { CreateProblem, probImmutableFields, ProblemEntity } from '../models/problems.entity';

@InputType()
export class CreateProblemInput extends createEntityType(ProblemEntity, probImmutableFields) implements CreateProblem {
  @Field(() => Int, { nullable: true })
  public id?: number;
}
