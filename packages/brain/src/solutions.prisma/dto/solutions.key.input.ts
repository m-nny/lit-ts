import { InputType, PickType } from '@nestjs/graphql';
import { SolutionEntity } from '../models/solutions.entity';

@InputType()
export class SolutionKeyInput extends PickType(SolutionEntity, ['id'], InputType) {}
