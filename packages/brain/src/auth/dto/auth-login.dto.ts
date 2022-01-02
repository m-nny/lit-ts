import { IsString } from 'class-validator';
import { UserCredentials } from '../../users/models/plain-users.type';

export class UserCredentialsDto implements UserCredentials {
  @IsString()
  username!: string;

  @IsString()
  plainPassword!: string;
}
