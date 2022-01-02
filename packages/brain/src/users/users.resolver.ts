import { Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@Resolver(UserEntity)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [UserEntity], { name: 'allUsers' })
  async getUsers(): Promise<UserEntity[]> {
    const items = await this.usersService.findAll();
    return items;
  }
}
