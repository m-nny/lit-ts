import { Field, InputType } from '@nestjs/graphql';
import { UpdatePlainUser } from '../models/plain-users.type';
import { UserKeyInput } from './users.key.input';

@InputType()
export class UpdateUserPatchInput implements UpdatePlainUser {
  @Field({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  plainPassword?: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  key: UserKeyInput;

  @Field()
  patch: UpdateUserPatchInput;
}
