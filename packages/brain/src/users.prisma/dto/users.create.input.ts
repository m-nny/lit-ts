import { UserRole } from '.prisma/client';
import { Field, InputType } from '@nestjs/graphql';
import { AppUserRole } from '../../auth/models/jwt.app-user';
import { CreateUserParams } from '../users.service';

@InputType()
export class CreateUserInput implements CreateUserParams {
  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field()
  plainPassword: string;

  @Field(() => AppUserRole, { nullable: true })
  role?: UserRole;
}
