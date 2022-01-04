import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RequireAuth } from '../auth/decorators/auth.decorator';
import { AppUserRole } from '../auth/models/jwt.app-user';
import { wrapEntityList } from '../utils/entity.list';
import { CreateProblemInput } from './dto/problems.create.input';
import { ProblemKeyInput } from './dto/problems.key.input';
import { UpdateProblemInput } from './dto/problems.update.input';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsList } from './models/problems.list';
import { ProblemsService } from './problems.service';

@Resolver(ProblemEntity)
@RequireAuth(AppUserRole.admin)
export class ProblemsResolver {
  constructor(private problemsService: ProblemsService) {}

  @Query(() => ProblemsList, { name: 'allProblems' })
  async findAll(): Promise<ProblemsList> {
    const [items, count] = await this.problemsService.findAll();
    return wrapEntityList(items, count);
  }

  @Query(() => ProblemEntity, { name: 'problemByKey', nullable: true })
  async findById(@Args() key: ProblemKeyInput): Promise<ProblemEntity | null> {
    console.log({ key });
    const item = await this.problemsService.findOne(key);
    return item;
  }

  @Mutation(() => ProblemEntity, { name: 'createProblem' })
  async create(@Args('input') body: CreateProblemInput): Promise<ProblemEntity> {
    const item = await this.problemsService.create(body);
    return item;
  }

  @Mutation(() => ProblemEntity, { name: 'updateProblem' })
  async update(@Args('input') { key, patch }: UpdateProblemInput): Promise<ProblemEntity> {
    const item = await this.problemsService.update(key, patch);
    return item;
  }
}
