import { MikroOrmModule as NestMikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MikroOrmSchemaGenerator } from './mikro-orm.schema-generator';

@Module({
  imports: [
    NestMikroOrmModule.forRoot({
      // TODO(m-nny): move to config
      autoLoadEntities: true,

      dbName: 'brain',
      type: 'postgresql',
      host: 'localhost',
      port: 9001,
      user: 'lit',
      password: 'change-in-production',
    }),
  ],
  providers: [MikroOrmSchemaGenerator],
})
export class MikroOrmModule {}
