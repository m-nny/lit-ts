import { Field, InputType } from '@nestjs/graphql';
import { CreateProblemParams } from '../problems.service';

@InputType()
export class CreateProblemInput implements CreateProblemParams {
  @Field()
  title: string;

  @Field()
  authorUsername: string;
}
