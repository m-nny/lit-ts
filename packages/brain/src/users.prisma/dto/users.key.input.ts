import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserKeyInput {
  @Field()
  username: string;
}
