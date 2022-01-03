import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { MikroOrmSchemaGenerator } from './mikro-orm/mikro-orm.schema-generator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const schemaGenerator = await app.resolve(MikroOrmSchemaGenerator);
  await schemaGenerator.synchronize();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {},
    })
  );
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3001'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  Logger.log(`🚀 Application is running on:`);
  Logger.log(`🚀   Graphql: http://localhost:${port}/graphql`);
  Logger.log(`🚀   Rest: http://localhost:${port}/api`);
}

bootstrap();
