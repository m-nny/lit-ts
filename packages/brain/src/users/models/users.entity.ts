import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { AppUser } from '../../auth/models/jwt.app-user';
import { BaseEntity } from '../../utils/entity.base';
import { CreateEntity, EntityPK, UpdateEntity } from '../../utils/entity.utils';

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

  //FIXME(m-nny): maybe add class-tranformator(?)
  constructor(dto: CreateUser) {
    super();
    this.username = dto.username;
    this.fullName = dto.fullName;
    this.hashedPassword = dto.hashedPassword;
  }

  toAppUser(): AppUser {
    return {
      username: this.username,
    };
  }
}

export type UserKey = EntityPK<UserEntity, 'username'>;
export type CreateUser = CreateEntity<UserEntity, never>;
export type UpdateUser = UpdateEntity<UserEntity, 'username'>;
