import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { ProblemEntity } from '../../problems/models/problems.entity';
import { UserEntity } from '../../users/models/users.entity';
import { BaseEntity } from '../../utils/entity.base';
import { CreateEntity, EntityPK, pickFieldName, UpdateEntity } from '../../utils/entity.utils';
import { GradingStatus } from './grading.status';

registerEnumType(GradingStatus, { name: 'SolutionGradingStatus' });

@ObjectType('Solution')
@Entity()
export class SolutionEntity extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  public id: number;

  @Field()
  @ManyToOne()
  public author: UserEntity;

  @Field()
  @ManyToOne()
  public problem: ProblemEntity;

  @Field()
  @Property()
  public body: string;

  @Field(() => GradingStatus, { defaultValue: GradingStatus.InQueue })
  @Property({ type: 'string', default: GradingStatus.InQueue })
  public gradingStatus: GradingStatus;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public gradingResult: string;

  static fromPojo(item: CreateSolution, extra?: Partial<SolutionEntity>): SolutionEntity {
    return plainToClass(SolutionEntity, { ...item, ...extra });
  }
  static fromPojos(items: CreateSolution[], extra?: Partial<SolutionEntity>): SolutionEntity[] {
    return items.map((item) => SolutionEntity.fromPojo(item, extra));
  }
}

export const probRelations = pickFieldName(SolutionEntity, 'author', 'problem');
export const probImmutableFields = pickFieldName(SolutionEntity, 'id', ...probRelations);
export const probOptionalFields = pickFieldName(SolutionEntity, 'id', 'gradingResult', 'gradingStatus');

export type SolutionKey = EntityPK<SolutionEntity, 'id'>;
export type CreateSolution = CreateEntity<
  SolutionEntity,
  typeof probImmutableFields[number],
  typeof probOptionalFields[number]
>;
export type UpdateSolution = UpdateEntity<SolutionEntity, typeof probImmutableFields[number]>;
