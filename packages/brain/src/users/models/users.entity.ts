import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { AppUser, AppUserRole } from '../../auth/models/jwt.app-user';
import { BaseEntity } from '../../utils/entity.base';
import { CreateEntity, EntityPK, UpdateEntity } from '../../utils/entity.utils';

registerEnumType(AppUserRole, { name: 'UserRole' });

@ObjectType('User_old')
@Entity()
export class UserEntity extends BaseEntity {
  @Field()
  @PrimaryKey()
  username: string;

  @Field()
  @Property()
  fullName: string;

  @Property()
  hashedPassword: string;

  @Field(() => [AppUserRole])
  @Property({ type: JsonType })
  roles: AppUserRole[];

  static fromPojo(item: CreateUser, extra?: Partial<UserEntity>): UserEntity {
    return plainToClass(UserEntity, { ...item, ...extra });
  }
  static fromPojos(items: CreateUser[], extra?: Partial<UserEntity>): UserEntity[] {
    return items.map((item) => UserEntity.fromPojo(item, extra));
  }
  toAppUser(): AppUser {
    return {
      username: this.username,
      roles: this.roles,
    };
  }
}

export type UserKey = EntityPK<UserEntity, 'username'>;
export type CreateUser = CreateEntity<UserEntity, 'toAppUser'>;
export type UpdateUser = UpdateEntity<UserEntity, 'username'>;
