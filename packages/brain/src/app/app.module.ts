import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { GraphqlModule } from '../graphql/graphql.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersPrismaModule } from '../users.prisma/users.module';

@Module({
  imports: [
    GraphqlModule,
    ConfigModule,
    PrismaModule,
    UsersPrismaModule,
    // MikroOrmModule,
    // AuthModule,
    // SeedModule,
    // // DB Entities
    // UsersModule,
    // ProblemsModule,
    // SolutionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
