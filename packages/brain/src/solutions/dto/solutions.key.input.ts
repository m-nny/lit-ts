import { ArgsType, InputType } from '@nestjs/graphql';
import { entityPKType } from '../../utils/entity.utils';
import { SolutionEntity } from '../models/solutions.entity';

@InputType()
@ArgsType()
export class SolutionKeyInput extends entityPKType(SolutionEntity, ['id']) {}
