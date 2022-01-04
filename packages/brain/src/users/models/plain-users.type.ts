import { BaseEntityKeys } from '../../utils/entity.base';
import { CreateEntity, UpdateEntity } from '../../utils/entity.utils';
import { UserEntity } from './users.entity';

export type BaseUser = Omit<UserEntity, BaseEntityKeys | 'hashedPassword'>;

export type PlainUser = BaseUser & { plainPassword: string };
export type HashedUser = BaseUser & { hashedPassword: string };

export type UserCredentials = { username: string; plainPassword: string };

export type CreatePlainUser = CreateEntity<PlainUser, 'toAppUser'>;
export type UpdatePlainUser = UpdateEntity<PlainUser, 'username' | 'toAppUser'>;

export type UpdateHasedUser = UpdateEntity<HashedUser, 'username' | 'toAppUser'>;
