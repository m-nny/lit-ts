import { ArgsType, InputType } from '@nestjs/graphql';
import { entityPKType } from '../../utils/entity.utils';
import { ProblemEntity } from '../models/problems.entity';

@InputType()
@ArgsType()
export class ProblemKeyInput extends entityPKType(ProblemEntity, ['id']) {}
