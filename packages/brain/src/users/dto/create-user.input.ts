import { Field, InputType } from '@nestjs/graphql';
import { AppUserRole } from '../../auth/models/jwt.app-user';
import { createEntityType } from '../../utils/entity.utils';
import { CreatePlainUser } from '../models/plain-users.type';
import { UserEntity } from '../models/users.entity';

@InputType()
export class CreateUserInput
  extends createEntityType(UserEntity, ['hashedPassword'])
  implements CreatePlainUser
{
  @Field(() => [AppUserRole], { defaultValue: [AppUserRole.student] })
  roles: AppUserRole[];

  @Field()
  plainPassword: string;
}
