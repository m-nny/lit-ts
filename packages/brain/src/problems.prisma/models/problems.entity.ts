import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Problem as ProblemModel } from '@prisma/client';
import { UserEntity } from '../../users.prisma/models/users.entity';

@ObjectType('Problem')
export class ProblemEntity implements ProblemModel {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  authorUsername: string;

  @Field()
  author?: UserEntity;

  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
