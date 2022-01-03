import { GqlModuleAsyncOptions } from '@nestjs/graphql';
import { ConfigModule } from '../config/config.module';
import { ConfigWrapper } from '../config/config.wrapper';

export const graphqlModuleOptionsFactory: GqlModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigWrapper],
  useFactory: ({ config }: ConfigWrapper) => config.graphql,
};
