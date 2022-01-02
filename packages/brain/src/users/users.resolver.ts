import { Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './users.model';
import { UsersService } from './users.service';

@Resolver(UserModel)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [UserModel], { name: 'allUsers' })
  async getUsers(): Promise<UserModel[]> {
    const items = await this.usersService.findAll();
    return items;
  }
}
