import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../seed/seed.module';
import { AppModule } from './app.module';

export async function runSeedApp() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedModule = await app.resolve(SeedModule);
  await seedModule.seed();

  Logger.log('Seeding complete');
  process.exit(0);
}
