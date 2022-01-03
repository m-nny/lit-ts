import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UserEntity } from './models/users.entity';

@Repository(UserEntity)
export class UsersRepository extends EntityRepository<UserEntity> {}
