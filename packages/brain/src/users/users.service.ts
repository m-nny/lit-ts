import { Injectable } from '@nestjs/common';
import { UserModel } from './users.model';

@Injectable()
export class UsersService {
  private users: UserModel[] = [];
  async findAll(): Promise<UserModel[]> {
    return this.users;
  }
}
