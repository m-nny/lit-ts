import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { GraphqlModule } from '../graphql/graphql.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ProblemsPrismaModule } from '../problems.prisma/problems.module';
import { SolutionsPrismaModule } from '../solutions.prisma/solutions.module';
import { UsersPrismaModule } from '../users.prisma/users.module';

@Module({
  imports: [
    GraphqlModule,
    ConfigModule,
    PrismaModule,
    UsersPrismaModule,
    ProblemsPrismaModule,
    SolutionsPrismaModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
