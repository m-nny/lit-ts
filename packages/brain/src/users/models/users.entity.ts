import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AppUser, AppUserRole } from '../../auth/models/jwt.app-user';
import { BaseEntity } from '../../utils/entity.base';
import { CreateEntity, EntityPK, UpdateEntity } from '../../utils/entity.utils';

registerEnumType(AppUserRole, { name: 'UserRole' });

@ObjectType('User')
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

  //FIXME(m-nny): maybe add class-tranformator(?)
  constructor(dto: CreateUser) {
    super();
    this.username = dto.username;
    this.fullName = dto.fullName;
    this.hashedPassword = dto.hashedPassword;
    this.roles = dto.roles;
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
