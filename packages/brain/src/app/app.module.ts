import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MikroOrmModule } from '../mikro-orm/mikro-orm.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: 'schemas/brain.gql',
      sortSchema: true,
    }),
    MikroOrmModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
