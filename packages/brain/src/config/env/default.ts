import { AppEnv, cfgVar, createConfig } from '@lit-ts/config';

export const defaultConfig = createConfig({
  env: 'dev' as AppEnv,
  host: cfgVar.string('0.0.0.0'),
  port: cfgVar.number(3001),
  globalPrefix: cfgVar.string('/api'),
  cors: cfgVar.array([
    'http://localhost:4200',
    'http://localhost:3001',
    'https://studio.apollographql.com',
  ]),
  jwt: {
    secret: cfgVar.string('change-in-production'),
  },
  db: {
    synchronize: cfgVar.boolean(true),
    runMigration: cfgVar.boolean(false),
  },
  mikroOrm: {
    debug: cfgVar.boolean(true),
    autoLoadEntities: cfgVar.boolean(true),

    dbName: cfgVar.string('brain'),
    host: cfgVar.string('localhost'),
    port: cfgVar.number(9001),
    user: cfgVar.string('lit'),
    password: cfgVar.string('change-in-production'),
  },
  dogNail: {
    replacePublicUrlWith: cfgVar.stringOrNull(null),
  },
  graphql: {
    debug: cfgVar.boolean(true),
    autoSchemaFile: cfgVar.string('schemas/brain.gql'),
    sortSchema: cfgVar.boolean(true),
  },
  bcrypt: {
    saltOrRounds: cfgVar.number(10),
  },
});
