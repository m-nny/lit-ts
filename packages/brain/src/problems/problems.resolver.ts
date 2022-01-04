import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { RolesRequired } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/guards/jwt.guard';
import { AppUser, AppUserRole } from '../auth/models/jwt.app-user';
import { UserEntity, UserKey } from '../users/models/users.entity';
import { UsersService } from '../users/users.service';
import { wrapEntityList } from '../utils/entity.list';
import { CreateProblemInput } from './dto/problems.create.input';
import { ProblemKeyInput } from './dto/problems.key.input';
import { UpdateProblemInput } from './dto/problems.update.input';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsList } from './models/problems.list';
import { ProblemsService } from './problems.service';

@Resolver(ProblemEntity)
@RequireAuth(AppUserRole.Admin)
export class ProblemsResolver {
  constructor(private problemsService: ProblemsService, private usersService: UsersService) {}

  @Query(() => ProblemsList, { name: 'allProblems' })
  async findAll(): Promise<ProblemsList> {
    const [items, count] = await this.problemsService.findAll();
    return wrapEntityList(items, count);
  }

  @Query(() => ProblemEntity, { name: 'problemByKey', nullable: true })
  async findById(@Args('key') key: ProblemKeyInput): Promise<ProblemEntity | null> {
    const item = await this.problemsService.findOne(key);
    return item;
  }

  @Mutation(() => ProblemEntity, { name: 'createProblem' })
  @RolesRequired(AppUserRole.Instructor)
  async create(@Args('input') body: CreateProblemInput, @CurrentUser() appUser: AppUser): Promise<ProblemEntity> {
    const userKey: UserKey = { username: appUser.username };
    const item = await this.problemsService.create(body, userKey);
    return item;
  }

  @Mutation(() => ProblemEntity, { name: 'updateProblem' })
  async update(@Args('input') { key, patch }: UpdateProblemInput): Promise<ProblemEntity> {
    const item = await this.problemsService.update(key, patch);
    return item;
  }

  @ResolveField()
  async author(@Root() prob: ProblemEntity): Promise<UserEntity> {
    const authorKey: UserKey = { username: prob.author.username };
    const author = await this.usersService.findOne(authorKey);
    return author!;
  }
}
