import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { GraphqlModule } from '../graphql/graphql.module';
import { MikroOrmModule } from '../mikro-orm/mikro-orm.module';
import { ProblemsModule } from '../problems/problems.module';
import { SeedModule } from '../seed/seed.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GraphqlModule, ConfigModule, MikroOrmModule, AuthModule, SeedModule, UsersModule, ProblemsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
