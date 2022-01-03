import yargs from 'yargs/yargs';
import { runSeedApp } from './app/app.seed';
import { runWebApp } from './app/app.web';

async function bootstrap() {
  const argv = yargs(process.argv.slice(2)).options({
    seed: { type: 'boolean', default: false },
  }).argv;
  if (argv.seed) {
    await runSeedApp();
  } else {
    await runWebApp();
  }
}

bootstrap();
