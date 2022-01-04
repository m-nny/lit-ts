import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SolutionEntity } from './models/solutions.entity';

@Repository(SolutionEntity)
export class SolutionsRepository extends EntityRepository<SolutionEntity> {}
