import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { wrapEntityList } from '../utils/entity.list';
import { CreateUserInput } from './dto/users.create.input';
import { UserKeyInput } from './dto/users.key.input';
import { UserEntity } from './models/users.entity';
import { UsersList } from './models/users.list';
import { UsersPrismaService } from './users.service';

@Resolver(() => UserEntity)
export class UsersPrismaResolver {
  constructor(private readonly usersService: UsersPrismaService) {}

  @Query(() => UserEntity, { name: 'getUserById', nullable: true })
  async findById(@Args('key') key: UserKeyInput): Promise<UserEntity | null> {
    const item = await this.usersService.findOne(key);
    return item;
  }

  @Query(() => UsersList, { name: 'getUsers' })
  async findAll(): Promise<UsersList> {
    const [items, count] = await this.usersService.findMany({});
    return wrapEntityList(items, count);
  }

  @Mutation(() => UserEntity, { name: 'createUser' })
  async create(@Args('input') user: CreateUserInput): Promise<UserEntity> {
    const item = await this.usersService.create(user);
    return item;
  }

  @Query(() => String)
  async helloWorld() {
    return 'Hello, world';
  }
}
