import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User as UserModel, UserRole } from '@prisma/client';
import { AppUserRole } from '../../auth/models/jwt.app-user';

registerEnumType(AppUserRole, { name: 'UserRole' });

@ObjectType('User2')
export class UsersEntity implements UserModel {
  @Field()
  username: string;

  @Field()
  fullName: string;

  hashedPassword: string;

  @Field(() => AppUserRole)
  role: UserRole;

  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
