import { ObjectType } from '@nestjs/graphql';
import { entityList } from '../../utils/entity.list';
import { ProblemEntity } from './problems.entity';

@ObjectType()
export class ProblemsList extends entityList(ProblemEntity) {}
