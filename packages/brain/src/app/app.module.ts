import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from '../auth/auth.module';
import { MikroOrmModule } from '../mikro-orm/mikro-orm.module';
import { SeedModule } from '../seed/seed.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      // TODO(m-nny): move to config
      debug: true,
      autoSchemaFile: 'schemas/brain.gql',
      sortSchema: true,
    }),
    MikroOrmModule,
    UsersModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
