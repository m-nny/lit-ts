import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { RolesRequired } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/guards/jwt.guard';
import { AppUser, AppUserRole } from '../auth/models/jwt.app-user';
import { ProblemEntity, ProblemKey } from '../problems/models/problems.entity';
import { ProblemsService } from '../problems/problems.service';
import { UserEntity, UserKey } from '../users/models/users.entity';
import { UsersService } from '../users/users.service';
import { wrapEntityList } from '../utils/entity.list';
import { CreateSolutionInput } from './dto/solutions.create.input';
import { SolutionKeyInput } from './dto/solutions.key.input';
import { UpdateSolutionInput } from './dto/solutions.update.input';
import { SolutionEntity } from './models/solutions.entity';
import { SolutionsList } from './models/solutions.list';
import { SolutionsService } from './solutions.service';

@Resolver(SolutionEntity)
@RequireAuth(AppUserRole.Admin)
export class SolutionsResolver {
  constructor(
    private solutionsService: SolutionsService,
    private usersService: UsersService,
    private readonly probService: ProblemsService
  ) {}

  @Query(() => SolutionsList, { name: 'allSolutions' })
  async findAll(): Promise<SolutionsList> {
    const [items, count] = await this.solutionsService.findAll();
    return wrapEntityList(items, count);
  }

  @Query(() => SolutionEntity, { name: 'solutionByKey', nullable: true })
  async findById(@Args('key') key: SolutionKeyInput): Promise<SolutionEntity | null> {
    const item = await this.solutionsService.findOne(key);
    return item;
  }

  @Mutation(() => SolutionEntity, { name: 'createSolution' })
  @RolesRequired(AppUserRole.Instructor)
  async create(@Args('input') body: CreateSolutionInput, @CurrentUser() appUser: AppUser): Promise<SolutionEntity> {
    const userKey: UserKey = { username: appUser.username };
    const item = await this.solutionsService.create(body, userKey, body.problem);
    return item;
  }

  @Mutation(() => SolutionEntity, { name: 'updateSolution' })
  async update(@Args('input') { key, patch }: UpdateSolutionInput): Promise<SolutionEntity> {
    const item = await this.solutionsService.update(key, patch);
    return item;
  }

  @ResolveField()
  async author(@Root() item: SolutionEntity): Promise<UserEntity> {
    const authorKey: UserKey = { username: item.author.username };
    const author = await this.usersService.findOne(authorKey);
    return author!;
  }

  @ResolveField()
  async problem(@Root() item: SolutionEntity): Promise<ProblemEntity> {
    const problemKey: ProblemKey = { id: item.problem.id };
    const problem = await this.probService.findOne(problemKey);
    return problem!;
  }
}
