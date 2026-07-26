// Aspire TypeScript AppHost
// For more information, see: https://aspire.dev

import { createBuilder } from './.aspire/modules/aspire.mjs';

const builder = await createBuilder();

const sqlUserName = builder.addParameter('sqlUserName', { value: 'asia' });
const sqlPassword = builder.addParameter('sqlPassword', { secret: true });

await builder
  .addPostgres('sql', {
    userName: sqlUserName,
    password: sqlPassword,
  })
  .withPersistentLifetime()
  .withDataVolume();

await builder.build().run();
