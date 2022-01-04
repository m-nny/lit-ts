import { ArgsType, InputType } from '@nestjs/graphql';
import { entityPKType } from '../../utils/entity.utils';
import { UserEntity } from '../models/users.entity';

@InputType()
@ArgsType()
export class UserKeyInput extends entityPKType(UserEntity, ['username']) {}
