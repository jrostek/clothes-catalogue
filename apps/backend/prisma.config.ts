import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Aspire injects DATABASE_URL; for CLI use outside Aspire, put it in .env.
    // process.env rather than env() so `prisma generate` works without it.
    url: process.env.DATABASE_URL,
  },
});
