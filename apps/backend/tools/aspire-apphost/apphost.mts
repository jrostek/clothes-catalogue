// Aspire TypeScript AppHost
// For more information, see: https://aspire.dev

import { createBuilder } from './.aspire/modules/aspire.mjs';

const builder = await createBuilder();

const sqlUser = await builder.addParameter('postgresql-user', { value: 'sa' });
const sqlPassword = await builder.addParameter('postgresql-password', {
  secret: true,
});

const postgresql = await builder.addPostgres('db', {
  userName: sqlUser,
  password: sqlPassword,
});
await postgresql.withDataVolume();
const postgresqldb = await postgresql.addDatabase('clothes-catalogue');

await builder
  .addJavaScriptApp('api', '../..')
  .withRunScript('local')
  .withHttpEndpoint({ port: 3000, env: 'PORT' })
  .withExternalHttpEndpoints()
  .withReference(postgresqldb)
  .waitFor(postgresqldb);

await builder.build().run();
