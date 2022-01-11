import { SolutionGradingStatus } from '.prisma/client';
import { Field, InputType, Int } from '@nestjs/graphql';
import { GradingStatus } from '../models/grading.status';
import { CreateSolutionParams } from '../solutions.service';

@InputType()
export class CreateSolutionInput implements CreateSolutionParams {
  @Field()
  body: string;

  @Field(() => GradingStatus, { defaultValue: GradingStatus.InQueue })
  gradingStatus?: SolutionGradingStatus;

  @Field(() => String, { nullable: true })
  gradingResult?: string | null;

  @Field()
  authorUsername: string;

  @Field(() => Int)
  problemId: number;
}
