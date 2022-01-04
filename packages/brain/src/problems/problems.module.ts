import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ProblemEntity } from './models/problems.entity';
import { ProblemsResolver } from './problems.resolver';
import { ProblemsService } from './problems.service';

@Module({
  imports: [MikroOrmModule.forFeature([ProblemEntity]), ConfigModule],
  providers: [ProblemsService, ProblemsResolver],
  exports: [],
})
export class ProblemsModule {}
