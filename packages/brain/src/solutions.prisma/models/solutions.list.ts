import { ObjectType } from '@nestjs/graphql';
import { entityList } from '../../utils/entity.list';
import { SolutionEntity } from './solutions.entity';

@ObjectType()
export class SolutionsList extends entityList(SolutionEntity) {}
