import { Injectable, Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { CreateUserInput } from '../users/dto/create-user.input';
import { CreatePlainUser } from '../users/models/plain-users.type';
import { BcryptService } from '../users/users.bcrypt';
import { UsersService } from '../users/users.service';

const mockUsers: CreatePlainUser[] = [
  {
    username: 'jane-doe',
    fullName: 'Jane Doe',
    plainPassword: 'super_secret_password',
    roles: [AppUserRole.admin],
  },
];

@Injectable()
export class SeedUsersService {
  private logger = new Logger(SeedUsersService.name);
  public constructor(
    private usersService: UsersService,
    private bcrypt: BcryptService
  ) {}
  public async seed() {
    const plainUsers = mockUsers.map((user) =>
      plainToClass(CreateUserInput, user)
    );
    const hashedUsers = await this.bcrypt.hashUsers(plainUsers);
    const users = await this.usersService.upsertMultiple(hashedUsers);
    this.logger.log(`Created ${users.length} users`);
    return users;
  }
}
