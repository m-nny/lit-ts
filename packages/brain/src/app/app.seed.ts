import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MikroOrmSchemaGenerator } from '../mikro-orm/mikro-orm.schema-generator';
import { SeedModule } from '../seed/seed.module';
import { AppModule } from './app.module';

export async function runSeedApp() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const schemaGenerator = await app.resolve(MikroOrmSchemaGenerator);
  await schemaGenerator.synchronize();

  const seedModule = await app.resolve(SeedModule);

  await seedModule.seed();

  Logger.log('Seeding complete');
  process.exit(0);
}
