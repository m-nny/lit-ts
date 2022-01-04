import { Field, InputType } from '@nestjs/graphql';
import { updateEntityType } from '../../utils/entity.utils';
import { probImmutableFields, SolutionEntity, UpdateSolution } from '../models/solutions.entity';
import { SolutionKeyInput } from './solutions.key.input';

@InputType()
export class UpdateSolutionPatchInput
  extends updateEntityType(SolutionEntity, probImmutableFields)
  implements UpdateSolution {}

@InputType()
export class UpdateSolutionInput {
  @Field()
  key!: SolutionKeyInput;

  @Field()
  patch!: UpdateSolutionPatchInput;
}
