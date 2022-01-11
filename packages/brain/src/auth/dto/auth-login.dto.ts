import { IsString } from 'class-validator';
import { UserCredentials } from '../../users.prisma/users.service';

export class UserCredentialsDto implements UserCredentials {
  @IsString()
  username!: string;

  @IsString()
  plainPassword!: string;
}
