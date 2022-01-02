import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MikroOrmSchemaGenerator } from './mikro-orm/mikro-orm.schema-generator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const schemaGenerator = await app.resolve(MikroOrmSchemaGenerator);
  await schemaGenerator.synchronize();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/graphql`);
}

bootstrap();
