import { Connection, IDatabaseDriver } from '@mikro-orm/core';
import {
  MikroOrmModuleOptions,
  MikroOrmOptionsFactory,
} from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigWrapper } from '../config/config.wrapper';

@Injectable()
export class MikroOrmModuleConfig implements MikroOrmOptionsFactory {
  private config;
  constructor({ config }: ConfigWrapper) {
    this.config = config;
  }
  createMikroOrmOptions(): MikroOrmModuleOptions<IDatabaseDriver<Connection>> {
    return {
      type: 'postgresql',
      ...this.config.mikroOrm,
    };
  }
}
