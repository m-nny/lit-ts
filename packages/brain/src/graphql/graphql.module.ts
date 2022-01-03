import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { graphqlModuleOptionsFactory } from './graphql.config';

@Module({
  imports: [NestGraphQLModule.forRootAsync(graphqlModuleOptionsFactory)],
})
export class GraphqlModule {}
