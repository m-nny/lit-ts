import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProblemsPrismaModule } from '../problems.prisma/problems.module';
import { UsersPrismaModule } from '../users.prisma/users.module';
import { SolutionsPrismaResolver } from './solutions.resolver';
import { SolutionsPrismaService } from './solutions.service';

@Module({
  imports: [PrismaModule, ConfigModule, UsersPrismaModule, ProblemsPrismaModule],
  providers: [SolutionsPrismaService, SolutionsPrismaResolver],
  controllers: [],
  exports: [SolutionsPrismaService],
})
export class SolutionsPrismaModule {}
