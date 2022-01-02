import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
@Entity({ tableName: 'user' })
export class UserEntity {
  @Field(() => Int)
  @PrimaryKey()
  id: number;

  @Field()
  fullName: string;

  hashedPassword: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
