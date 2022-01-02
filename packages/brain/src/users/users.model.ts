import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserModel {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;

  hashedPassword: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
