import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      autoSchemaFile: 'schemas/brain.gql',
      sortSchema: true,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
