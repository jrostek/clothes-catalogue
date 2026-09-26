// Aspire TypeScript AppHost
// For more information, see: https://aspire.dev

import { createBuilder } from './.aspire/modules/aspire.mjs';

const builder = await createBuilder();

const sqlUserName = builder.addParameter('sqlUserName', { value: 'asia' });
const sqlPassword = builder.addParameter('sqlPassword', { secret: true });

const sql = await builder
  .addPostgres('sql', {
    userName: sqlUserName,
    password: sqlPassword,
  })
  .withPersistentLifetime()
  .withDataVolume();

const db = await sql.addDatabase('clothes-catalogue');

const cache = await builder.addRedis('cache');

await builder
  .addJavaScriptApp('backend', '../..', { runScriptName: 'nest:start' })
  .withHttpEndpoint({ name: 'http', env: 'PORT' })
  .withUrlForEndpoint('http', async (url) => {
    url.displayText = 'Swagger UI';
    url.url = '/swagger';
  })
  .withReference(db)
  .withReference(cache)
  .waitFor(db)
  .waitFor(cache);

await builder.build().run();
