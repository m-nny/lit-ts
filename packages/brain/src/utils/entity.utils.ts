import { Type } from '@nestjs/common';
import { InputType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { ClassDecoratorFactory } from '@nestjs/graphql/dist/interfaces/class-decorator-factory.interface';
import { BaseEntity, baseEntityKeys, BaseEntityKeys } from './entity.base';

export type EntityPK<T, pick extends keyof T> = Pick<T, pick>;

export type UpdateEntity<T, ImmutableFields extends keyof T> = Partial<
  Omit<T, BaseEntityKeys | ImmutableFields>
>;

export type CreateEntity<
  T,
  ImmutableFields extends keyof T,
  OptionalFields extends keyof T = never
> = Omit<T, BaseEntityKeys | ImmutableFields | OptionalFields> &
  Partial<Pick<T, OptionalFields>>;

//export type EntityCondition<E> = FindConditions<E> | FindConditions<E>[];

export const pickFieldName = <E, K extends keyof E = never>(
  _: Type<E>,
  ...keys: K[]
): K[] => keys;

export function entityPKType<T extends BaseEntity, K extends keyof T>(
  classRef: Type<T>,
  pkFiels: readonly K[],
  decorator: ClassDecoratorFactory = InputType
): Type<EntityPK<T, typeof pkFiels[number]>> {
  return PickType(classRef, pkFiels, decorator);
}
export function updateEntityType<T extends BaseEntity, K extends keyof T>(
  classRef: Type<T>,
  immutableFields: readonly K[],
  decorator: ClassDecoratorFactory = InputType
): Type<UpdateEntity<T, typeof immutableFields[number]>> {
  return PartialType(
    OmitType(classRef, [...immutableFields, ...baseEntityKeys], decorator),
    decorator
  );
}

// TODO(m-nny): add partial optional fields
export function createEntityType<T extends BaseEntity, K extends keyof T>(
  classRef: Type<T>,
  immutableFields: readonly K[] = [],
  decorator: ClassDecoratorFactory = InputType
) {
  return OmitType(classRef, [...immutableFields, ...baseEntityKeys], decorator);
}
