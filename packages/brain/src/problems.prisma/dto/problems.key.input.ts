import { InputType, PickType } from '@nestjs/graphql';
import { ProblemEntity } from '../models/problems.entity';

@InputType()
export class ProblemKeyInput extends PickType(ProblemEntity, ['id'], InputType) {}
