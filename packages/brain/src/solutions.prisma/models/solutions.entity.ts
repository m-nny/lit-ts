import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Solution as SolutionModel, SolutionGradingStatus } from '@prisma/client';
import { ProblemEntity } from '../../problems.prisma/models/problems.entity';
import { UserEntity } from '../../users.prisma/models/users.entity';
import { GradingStatus } from './grading.status';

registerEnumType(GradingStatus, { name: 'SolutionGradingStatus' });

@ObjectType('Solution')
export class SolutionEntity implements SolutionModel {
  @Field(() => Int)
  id: number;

  @Field()
  body: string;

  @Field(() => GradingStatus, { defaultValue: GradingStatus.InQueue })
  gradingStatus: SolutionGradingStatus;

  @Field(() => String, { nullable: true })
  gradingResult: string | null;

  @Field()
  authorUsername: string;
  @Field()
  author?: UserEntity;

  @Field(() => Int)
  problemId: number;
  @Field()
  problem?: ProblemEntity;

  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
