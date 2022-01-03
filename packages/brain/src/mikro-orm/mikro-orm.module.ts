import { MikroOrmModule as NestMikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { MikroOrmModuleConfig } from './mikro-orm.config';
import { MikroOrmSchemaGenerator } from './mikro-orm.schema-generator';

@Module({
  imports: [
    NestMikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MikroOrmModuleConfig,
    }),
    ConfigModule,
  ],
  providers: [MikroOrmSchemaGenerator],
})
export class MikroOrmModule {}
