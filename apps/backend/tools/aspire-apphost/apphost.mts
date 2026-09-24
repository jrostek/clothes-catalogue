// Aspire TypeScript AppHost
// For more information, see: https://aspire.dev

import { createBuilder } from './.aspire/modules/aspire.mjs';

const builder = await createBuilder();

const sqlUserName = builder.addParameter('sqlUserName', { value: 'asia' });
const sqlPassword = builder.addParameter('sqlPassword', { secret: true });

// Fixed host port, so the Prisma CLI can reach the database from a .env file.
const sql = await builder
  .addPostgres('sql', {
    userName: sqlUserName,
    password: sqlPassword,
    port: 5432,
  })
  .withPersistentLifetime()
  .withDataVolume();

const db = await sql.addDatabase('clothes-catalogue');

const databaseUrl = await db.uriExpression();

const cache = await builder.addRedis('cache');

// Applies pending Prisma migrations and exits; the backend starts after it.
const migrations = await builder
  .addJavaScriptApp('db-migrations', '../..', {
    runScriptName: 'prisma:migrate:deploy',
  })
  .withEnvironment('DATABASE_URL', databaseUrl)
  .waitFor(db);

await builder
  .addJavaScriptApp('backend', '../..', { runScriptName: 'nest:start' })
  .withHttpEndpoint({ name: 'http', env: 'PORT' })
  .withUrlForEndpoint('http', async (url) => {
    url.displayText = 'Swagger UI';
    url.url = '/swagger';
  })
  .withReference(db)
  .withReference(cache)
  .withEnvironment('DATABASE_URL', databaseUrl)
  .waitFor(db)
  .waitFor(cache)
  .waitForCompletion(migrations);

await builder.build().run();
