import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ProblemEntity } from './models/problems.entity';

@Repository(ProblemEntity)
export class ProblemsRepository extends EntityRepository<ProblemEntity> {}
