import { Field, InputType } from '@nestjs/graphql';
import { updateEntityType } from '../../utils/entity.utils';
import { probImmutableFields, ProblemEntity, UpdateProblem } from '../models/problems.entity';
import { ProblemKeyInput } from './problems.key.input';

@InputType()
export class UpdateProblemPatchInput
  extends updateEntityType(ProblemEntity, probImmutableFields)
  implements UpdateProblem {}

@InputType()
export class UpdateProblemInput {
  @Field()
  key!: ProblemKeyInput;

  @Field()
  patch!: UpdateProblemPatchInput;
}
