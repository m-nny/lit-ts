import { Module } from '@nestjs/common';
import { ConfigWrapper, configWrapperFactory } from './config.wrapper';

@Module({
  providers: [configWrapperFactory],
  exports: [ConfigWrapper],
})
export class ConfigModule {}
