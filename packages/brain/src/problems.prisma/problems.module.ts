import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersPrismaModule } from '../users.prisma/users.module';
import { ProblemsPrismaResolver } from './problems.resolver';
import { ProblemsPrismaService } from './problems.service';

@Module({
  imports: [PrismaModule, ConfigModule, UsersPrismaModule],
  providers: [ProblemsPrismaService, ProblemsPrismaResolver],
  controllers: [],
  exports: [ProblemsPrismaService],
})
export class ProblemsPrismaModule {}
