import { PlainConfigShape, loadConfig } from '@lit-ts/config';
import { FactoryProvider, Injectable, Logger } from '@nestjs/common';
import { defaultConfig } from './env/default';

export type AppPlainConfig = PlainConfigShape<typeof defaultConfig>;

@Injectable()
export class ConfigWrapper {
  private logger = new Logger('ConfigLogger');
  constructor(public config: AppPlainConfig) {
    this.logger.debug('Config loaded: ' + JSON.stringify(config, null, 4));
  }
  static load(): ConfigWrapper {
    const config = loadConfig({
      defaultConfig,
    });
    return new ConfigWrapper(config);
  }
}

export const configWrapperFactory: FactoryProvider<ConfigWrapper> = {
  provide: ConfigWrapper,
  useFactory: ConfigWrapper.load,
};
