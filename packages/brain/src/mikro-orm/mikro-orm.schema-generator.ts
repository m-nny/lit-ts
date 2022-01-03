import { MikroORM } from '@mikro-orm/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigWrapper } from '../config/config.wrapper';

@Injectable()
export class MikroOrmSchemaGenerator implements OnModuleInit {
  private config;
  constructor(private orm: MikroORM, { config }: ConfigWrapper) {
    this.config = config;
  }
  async onModuleInit() {
    if (this.config.db.synchronize) {
      await this.synchronize();
    }
    if (this.config.db.runMigration) {
      await this.runMigration();
    }
  }
  async runMigration() {
    throw new Error('Method not implemented.');
  }

  async synchronize() {
    const generator = this.orm.getSchemaGenerator();

    await generator.updateSchema();
  }
}
