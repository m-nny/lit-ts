import { ObjectType } from '@nestjs/graphql';
import { entityList } from '../../utils/entity.list';
import { UserEntity } from './users.entity';

@ObjectType()
export class UsersList extends entityList(UserEntity) {}
