import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { RolesRequired } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/guards/jwt.guard';
import { AppUser, AppUserRole } from '../auth/models/jwt.app-user';
import { wrapEntityList } from '../utils/entity.list';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserKeyInput } from './dto/users.key.input';
import { UserEntity, UserKey } from './models/users.entity';
import { UsersList } from './models/users.list';
import { BcryptService } from './users.bcrypt';
import { UsersService } from './users.service';

@Resolver(UserEntity)
@RequireAuth(AppUserRole.Admin)
export class UsersResolver {
  constructor(private usersService: UsersService, private bcrypt: BcryptService) {}

  @Query(() => UsersList, { name: 'allUsers' })
  async findAll(): Promise<UsersList> {
    const [items, count] = await this.usersService.findAll();
    return wrapEntityList(items, count);
  }

  @Query(() => UserEntity, { name: 'userByKey', nullable: true })
  async findById(@Args('key') key: UserKeyInput): Promise<UserEntity | null> {
    const item = await this.usersService.findOne(key);
    return item;
  }

  @Mutation(() => UserEntity, { name: 'createUser' })
  async create(@Args('input') plainUser: CreateUserInput): Promise<UserEntity> {
    const hashedUser = await this.bcrypt.hashUser(plainUser);
    const item = await this.usersService.create(hashedUser);
    return item;
  }

  @Mutation(() => UserEntity, { name: 'updateUser' })
  async update(@Args('input') { key, patch }: UpdateUserInput): Promise<UserEntity> {
    const hashedPatch = await this.bcrypt.hashUserPatch(patch);
    const item = await this.usersService.update(key.username, hashedPatch);
    return item;
  }

  @Query(() => UserEntity, { nullable: true })
  @RolesRequired(AppUserRole.Student)
  async whoAmI(@CurrentUser() appUser: AppUser): Promise<UserEntity | null> {
    const appUserKey: UserKey = { username: appUser.username };
    const item = await this.usersService.findOne(appUserKey);
    return item;
  }
}
