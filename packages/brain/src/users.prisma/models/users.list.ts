import { ObjectType } from '@nestjs/graphql';
import { entityList } from '../../utils/entity.list';
import { UsersEntity } from './users.entity';

@ObjectType()
export class UsersList extends entityList(UsersEntity) {}
