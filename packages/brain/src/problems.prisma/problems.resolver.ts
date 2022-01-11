import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { UserEntity } from '../users.prisma/models/users.entity';
import { UsersPrismaService } from '../users.prisma/users.service';
import { wrapEntityList } from '../utils/entity.list';
import { CreateProblemInput } from './dto/problems.create.input';
import { ProblemKeyInput } from './dto/problems.key.input';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsList } from './models/problems.list';
import { ProblemsPrismaService } from './problems.service';

@Resolver(() => ProblemEntity)
@RequireAuth(AppUserRole.Admin)
export class ProblemsPrismaResolver {
  constructor(
    private readonly problemsService: ProblemsPrismaService,
    private readonly usersService: UsersPrismaService
  ) {}

  @Query(() => ProblemEntity, { name: 'getProblemById', nullable: true })
  async findById(@Args('key') key: ProblemKeyInput): Promise<ProblemEntity | null> {
    const item = await this.problemsService.findOne(key);
    return item;
  }

  @Query(() => ProblemsList, { name: 'getProblems' })
  async findAll(): Promise<ProblemsList> {
    const [items, count] = await this.problemsService.findMany({});
    return wrapEntityList(items, count);
  }

  @Mutation(() => ProblemEntity, { name: 'createProblem' })
  async create(@Args('input') problem: CreateProblemInput): Promise<ProblemEntity> {
    const item = await this.problemsService.create(problem);
    return item;
  }

  @ResolveField()
  async author(@Root() prob: ProblemEntity): Promise<UserEntity> {
    const authorUsername = prob.authorUsername;
    const author = await this.usersService.findOne({ username: authorUsername });
    return author!;
  }
}
