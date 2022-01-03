import { Logger } from '@nestjs/common';
import { config } from 'dotenv';
import { flatten, unflatten } from 'flat';
import _ from 'lodash';
import path from 'path';
import {
  AppEnvConfigShape,
  AppEnvOverride,
  appEnvs,
  PartialConfigShape,
  PlainConfigShape,
  RootConfigShape,
} from './config.types';
import { loadStrFromFile } from './config.utils';

const PROJECT_PREFIX = 'LIT';
const DOTENV_PATH = path.resolve(process.cwd(), `.env.local`);
const APP_ENV_KEY = `${PROJECT_PREFIX}_env` as const;

export type LoadConfigArgs<C extends RootConfigShape> = {
  defaultConfig: C;
  appEnvOverrides?: AppEnvOverride<C>;
  override?: PartialConfigShape<C>;
};

export const loadConfig = <C extends RootConfigShape>({
  defaultConfig,
  override = {},
  appEnvOverrides = {},
}: LoadConfigArgs<C>): PlainConfigShape<C> => {
  const logger = new Logger('ConfigLoader');
  const { parsed = {} } = config({ path: DOTENV_PATH });
  const envVariables = Object.assign(parsed, process.env);

  let appEnv = appEnvs.find((env) => env === parsed[APP_ENV_KEY]);

  if (!appEnv) {
    logger.warn('App environment not set. defaulting to "dev"');
    appEnv = 'dev';
  }

  const appEnvOverride: AppEnvConfigShape<C> = _.merge(
    { env: appEnv },
    appEnvOverrides[appEnv]
  );

  const fromAppEnvOverride: Record<string, unknown> = flatten(appEnvOverride, {
    delimiter: '_',
    safe: true,
  });
  const fromOverride: Record<string, unknown> = flatten(override, {
    delimiter: '_',
    safe: true,
  });
  const flatConfig: Record<string, (override: string | undefined) => unknown> =
    flatten(defaultConfig, {
      delimiter: '_',
    });
  const overrides: Record<string, string> = {};
  const overridedFlatConfig = Object.entries(flatConfig).reduce(
    (acc, [key, valueFnOrValue]) => {
      const parseEnv = (val: string | undefined) =>
        typeof valueFnOrValue === 'function' ? valueFnOrValue(val) : val;

      const ENV_KEY = `${PROJECT_PREFIX}_${key}`;
      const ENV_FILE_KEY = `${PROJECT_PREFIX}_${key}_FILE`;
      const fromEnv =
        envVariables[ENV_KEY] === undefined
          ? undefined
          : parseEnv(envVariables[ENV_KEY]);
      const fromEnvFile =
        envVariables[ENV_FILE_KEY] === undefined
          ? undefined
          : parseEnv(loadStrFromFile(envVariables[ENV_FILE_KEY]));
      // загрузка из источников:
      // arg - первый приоритет из аргументов `loadConfig`
      // env - из переменных окружения и .env файла
      // envf - из переменных окружения FILE и .env файла
      // sta - статический конфиг, соответствующий окружению
      // def - конфиг по-умолчанию default.ts
      // err - ошибка при загрузке
      const values: Array<
        ['arg' | 'env' | 'envf' | 'sta' | 'def' | 'err', unknown]
      > = [
        ['arg', fromOverride[key]],
        ['envf', fromEnvFile],
        ['env', fromEnv],
        ['sta', fromAppEnvOverride[key]],
        [
          'def',
          typeof valueFnOrValue === 'function'
            ? valueFnOrValue(undefined)
            : valueFnOrValue,
        ],
      ];

      const [from, value] = values.find(([, x]) => x !== undefined) || [
        'err',
        undefined,
      ];
      acc[key] = value;

      overrides[key] = `[${from}] -> ${value} (${typeof value}) trace: [${values
        .map(([, x]) => String(x))
        .join(' -> ')}]`;
      return acc;
    },
    {} as Record<string, unknown>
  );

  const overridedConfig: PlainConfigShape<C> = unflatten(overridedFlatConfig, {
    delimiter: '_',
  });

  return overridedConfig;
};
