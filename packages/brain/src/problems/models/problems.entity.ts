import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../../users/models/users.entity';
import { BaseEntity } from '../../utils/entity.base';
import { CreateEntity, EntityPK, pickFieldName, UpdateEntity } from '../../utils/entity.utils';

@ObjectType('Problem')
@Entity()
export class ProblemEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  public id: number;

  @Field()
  @ManyToOne()
  public author: UserEntity;

  @Field()
  @Property()
  public title: string;

  @Field()
  @Property()
  public solution: string;
}

export const probRelations = pickFieldName(ProblemEntity, 'author');
export const probImmutableFields = pickFieldName(ProblemEntity, 'id', ...probRelations);
export const probOptionalFields = pickFieldName(ProblemEntity, 'id');

export type ProblemKey = EntityPK<ProblemEntity, 'id'>;
export type CreateProblem = CreateEntity<
  ProblemEntity,
  typeof probImmutableFields[number],
  typeof probOptionalFields[number]
>;
export type UpdateProblem = UpdateEntity<ProblemEntity, typeof probImmutableFields[number]>;
