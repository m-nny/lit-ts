import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { wrapEntityList } from '../utils/entity.list';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './models/users.entity';
import { UsersList } from './models/users.list';
import { BcryptService } from './users.bcrypt';
import { UsersService } from './users.service';

@Resolver(UserEntity)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private bcrypt: BcryptService
  ) {}

  @Query(() => UsersList, { name: 'allUsers' })
  async findAll(): Promise<UsersList> {
    const [items, count] = await this.usersService.findAll();
    return wrapEntityList(items, count);
  }

  @Query(() => UserEntity, { name: 'userByKey', nullable: true })
  async findById(
    @Args('username') username: string
  ): Promise<UserEntity | null> {
    const item = await this.usersService.findOne(username);
    return item;
  }

  @Mutation(() => UserEntity, { name: 'createUser' })
  async create(@Args('input') plainUser: CreateUserInput): Promise<UserEntity> {
    const hashedUser = await this.bcrypt.hashUser(plainUser);
    const item = await this.usersService.create(hashedUser);
    return item;
  }

  @Mutation(() => UserEntity, { name: 'updateUser' })
  async update(
    @Args('input') { key, patch }: UpdateUserInput
  ): Promise<UserEntity> {
    const hashedPatch = await this.bcrypt.hashUserPatch(patch);
    const item = await this.usersService.update(key.username, hashedPatch);
    return item;
  }
}
