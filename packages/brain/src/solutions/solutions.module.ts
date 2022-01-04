import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ProblemsModule } from '../problems/problems.module';
import { UsersModule } from '../users/users.module';
import { SolutionEntity } from './models/solutions.entity';
import { SolutionsResolver } from './solutions.resolver';
import { SolutionsService } from './solutions.service';

@Module({
  imports: [MikroOrmModule.forFeature([SolutionEntity]), ConfigModule, UsersModule, ProblemsModule],
  providers: [SolutionsService, SolutionsResolver],
  exports: [],
})
export class SolutionsModule {}
