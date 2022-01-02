import { Field, InputType } from '@nestjs/graphql';
import { CreatePlainUser } from '../models/plain-users.type';

@InputType()
export class CreateUserInput implements CreatePlainUser {
  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field()
  plainPassword: string;
}
