import { Type } from '@nestjs/common';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

export type EntityList<E> = {
  length: number;
  items: E[];
};

export const wrapEntityList = <E>(
  items: E[],
  length?: number
): EntityList<E> => ({ items, length: length ?? items.length });

export function entityList<E>(classRef: Type<E>): Type<EntityList<E>> {
  const { name } = classRef;

  @ObjectType(`${name}List`, { isAbstract: true })
  class EntityListObjType implements EntityList<E> {
    @Field(() => Int)
    length!: number;

    @Field(() => [classRef])
    items!: E[];
  }
  return EntityListObjType;
}

export type CreateMultipleEntites<E> = {
  items: E[];
};

export function createMultipleEntites<E>(
  classRef: Type<E>
): Type<CreateMultipleEntites<E>> {
  const { name } = classRef;

  @InputType(`CreateMultiple${name}Input`)
  class CreateMultipleEntitesInput {
    @Field(() => [classRef])
    public items!: E[];
  }
  return CreateMultipleEntitesInput;
}
