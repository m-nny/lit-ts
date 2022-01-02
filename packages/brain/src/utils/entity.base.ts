import { Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class BaseEntity {
  @Field()
  @Property()
  public createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();
}

export type BaseEntityKeys = keyof BaseEntity;
export const baseEntityKeys: BaseEntityKeys[] = ['createdAt', 'updatedAt'];
