import { Field, InputType, Int } from '@nestjs/graphql';
import { ProblemKeyInput } from '../../problems/dto/problems.key.input';
import { createEntityType } from '../../utils/entity.utils';
import { CreateSolution, probImmutableFields, SolutionEntity } from '../models/solutions.entity';

@InputType()
export class CreateSolutionInput
  extends createEntityType(SolutionEntity, probImmutableFields)
  implements CreateSolution
{
  @Field(() => Int, { nullable: true })
  public id?: number;

  @Field()
  public problem: ProblemKeyInput;
}
