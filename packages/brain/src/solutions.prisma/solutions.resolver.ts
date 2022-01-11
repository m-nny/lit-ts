import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { ProblemEntity } from '../problems.prisma/models/problems.entity';
import { ProblemsPrismaService } from '../problems.prisma/problems.service';
import { UserEntity } from '../users.prisma/models/users.entity';
import { UsersPrismaService } from '../users.prisma/users.service';
import { wrapEntityList } from '../utils/entity.list';
import { CreateSolutionInput } from './dto/solutions.create.input';
import { SolutionKeyInput } from './dto/solutions.key.input';
import { SolutionEntity } from './models/solutions.entity';
import { SolutionsList } from './models/solutions.list';
import { SolutionsPrismaService } from './solutions.service';

@Resolver(() => SolutionEntity)
@RequireAuth(AppUserRole.Admin)
export class SolutionsPrismaResolver {
  constructor(
    private readonly solutionsService: SolutionsPrismaService,
    private readonly usersService: UsersPrismaService,
    private readonly probsService: ProblemsPrismaService
  ) {}

  @Query(() => SolutionEntity, { name: 'getSolutionById', nullable: true })
  async findById(@Args('key') key: SolutionKeyInput): Promise<SolutionEntity | null> {
    const item = await this.solutionsService.findOne(key);
    return item;
  }

  @Query(() => SolutionsList, { name: 'getSolutions' })
  async findAll(): Promise<SolutionsList> {
    const [items, count] = await this.solutionsService.findMany({});
    return wrapEntityList(items, count);
  }

  @Mutation(() => SolutionEntity, { name: 'createSolution' })
  async create(@Args('input') solution: CreateSolutionInput): Promise<SolutionEntity> {
    const item = await this.solutionsService.create(solution);
    return item;
  }

  @ResolveField()
  async author(@Root() prob: SolutionEntity): Promise<UserEntity> {
    const authorUsername = prob.authorUsername;
    const author = await this.usersService.findOne({ username: authorUsername });
    return author!;
  }

  @ResolveField()
  async problem(@Root() solution: SolutionEntity): Promise<ProblemEntity> {
    const problemId = solution.problemId;
    const problem = await this.probsService.findOne({ id: problemId });
    return problem!;
  }
}
