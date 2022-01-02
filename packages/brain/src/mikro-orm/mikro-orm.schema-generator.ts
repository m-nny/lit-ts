import { MikroORM } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MikroOrmSchemaGenerator {
  constructor(private orm: MikroORM) {}

  async synchronize() {
    const generator = this.orm.getSchemaGenerator();

    await generator.updateSchema();
  }
}
